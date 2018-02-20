import service from './tasks.service';
import moment from 'moment';

const accountListId = 123;
const contactList = [];
const currentUser = { id: 321 };

describe('tasks.service', () => {
    let api, users, tasks, tasksTags, gettextCatalog, modal, serverConstants;
    beforeEach(() => {
        angular.mock.module(service);
        inject((
            $rootScope, _api_, _tasks_, _tasksTags_, _users_, _gettextCatalog_, _modal_,
            _serverConstants_
        ) => {
            api = _api_;
            modal = _modal_;
            users = _users_;
            tasks = _tasks_;
            tasksTags = _tasksTags_;
            gettextCatalog = _gettextCatalog_;
            serverConstants = _serverConstants_;
            api.account_list_id = accountListId;
            users.current = currentUser;
        });
        spyOn(api, 'post').and.callFake(() => Promise.resolve({ id: 1 }));
        spyOn(gettextCatalog, 'getString').and.callThrough();
        spyOn(gettextCatalog, 'getPlural').and.callThrough();
    });
    describe('create', () => {
        it('should return a Promise', () => {
            expect(tasks.create({})).toEqual(jasmine.any(Promise));
        });
        it('should only add 1 and only 1 comment on creation', (done) => {
            tasks.create({}, [], 'comment').then(() => {
                tasks.create({}, [], 'comment').then(() => {
                    let task = api.post.calls.argsFor(1)[1];
                    expect(task.comments.length).toEqual(1);
                    expect(task.comments[0].body).toEqual('comment');
                    done();
                });
            });
        });
        it('should only add 1 and only 1 comment on creation with contacts', (done) => {
            tasks.create({}, ['1', '2'], 'comment').then(() => {
                tasks.create({}, ['1', '2'], 'comment').then(() => {
                    let task = api.post.calls.argsFor(1)[0].data[0];
                    expect(task.comments.length).toEqual(1);
                    expect(task.comments[0].body).toEqual('comment');
                    done();
                });
            });
        });
    });
    describe('constructor', () => {
        it('should set default values', () => {
            expect(tasks.analytics).toEqual(null);
            expect(tasks.completeList).toEqual([]);
            expect(tasks.loading).toEqual(true);
        });
    });
    describe('save', () => {
        beforeEach(() => {
            spyOn(tasks, 'mutateTagList').and.callFake((data) => data);
            spyOn(tasks, 'mutateComment').and.callFake((data) => data);
            spyOn(api, 'put').and.callFake(() => Promise.resolve());
            spyOn(tasks, 'change').and.callFake(() => {});
        });
        const task = { id: 1 };
        it('should call mutateTagList', () => {
            tasks.save(task);
            expect(tasks.mutateTagList).toHaveBeenCalledWith(task);
        });
        it('should call mutateComment', () => {
            tasks.save(task, 'abc');
            expect(tasks.mutateComment).toHaveBeenCalledWith(task, 'abc');
        });
        it('should call the api', () => {
            tasks.save(task);
            expect(api.put).toHaveBeenCalledWith(`tasks/${task.id}`, task);
        });
        it('should call change', (done) => {
            tasks.save(task).then(() => {
                expect(tasks.change).toHaveBeenCalledWith();
                done();
            });
        });
    });
    describe('logModal', () => {
        beforeEach(() => {
            spyOn(serverConstants, 'load').and.callFake(() => Promise.resolve());
            spyOn(tasksTags, 'load').and.callFake(() => Promise.resolve());
            spyOn(tasks, 'getContactsForLogModal').and.callFake(() => Promise.resolve());
        });
        it('should open the log task modal', () => {
            spyOn(modal, 'open').and.callFake(() => {});
            tasks.logModal();
            expect(modal.open).toHaveBeenCalledWith({
                template: require('./modals/log/log.html'),
                controller: 'logTaskController',
                resolve: {
                    tags: ['tasksTags', jasmine.any(Function)],
                    0: ['serverConstants', jasmine.any(Function)],
                    contactsList: [ '$state', 'contacts', jasmine.any(Function) ]
                }
            });
        });
        it('should handle the resolves', () => {
            spyOn(modal, 'open').and.callThrough();
            tasks.logModal();
            expect(tasksTags.load).toHaveBeenCalledWith();
            expect(serverConstants.load).toHaveBeenCalledWith(['activity_hashes', 'next_actions', 'results', 'status_hashes']);
            expect(tasks.getContactsForLogModal).toHaveBeenCalledWith(jasmine.any(Object), jasmine.any(Object), []);
        });
    });
    describe('mutateComments', () => {
        it('should build a comment array', () => {
            users.current.id = 234;
            expect(tasks.mutateComments(['abc', 'def'])).toEqual([
                { id: jasmine.any(String), body: 'abc', person: { id: 234 } },
                { id: jasmine.any(String), body: 'def', person: { id: 234 } }
            ]);
        });
        it('should still build a comment array', () => {
            users.current.id = 321;
            expect(tasks.mutateComments([{ id: 333, body: 'abc', person: { id: 234 } }, 'def'])).toEqual([
                { id: jasmine.any(String), body: 'abc', person: { id: 234 } },
                { id: jasmine.any(String), body: 'def', person: { id: 321 } }
            ]);
        });
        it('should handle no comments', () => {
            expect(tasks.mutateComments([])).toEqual(null);
        });
        it('should handle empty comments', () => {
            expect(tasks.mutateComments([''])).toEqual(null);
        });
    });
    describe('reuseTask', () => {
        it('should be true', () => {
            expect(tasks.reuseTask({ result: 'Attempted' }, 'call')).toBeTruthy();
            expect(tasks.reuseTask({ result: 'Attempted - Left Message' }, 'call')).toBeTruthy();
        });
        it('should be false', () => {
            expect(tasks.reuseTask({ result: null }, 'call')).toBeFalsy();
            expect(tasks.reuseTask({ result: 'Attempted - Left Message' }, undefined)).toBeFalsy();
        });
    });
    describe('useContacts', () => {
        it('should be true', () => {
            expect(tasks.useContacts(undefined, false)).toBeTruthy();
            expect(tasks.useContacts({ result: 'Attempted - Left Message' }, true)).toBeTruthy();
        });
        it('should be false', () => {
            expect(tasks.useContacts({ result: '' }, false)).toBeFalsy();
            expect(tasks.useContacts({ result: 'Attempted - Left Message' }, undefined)).toBeFalsy();
        });
    });
    describe('getDataForAddTask', () => {
        describe('new task', () => {
            const activity = 'Call';
            let params = {
                activityType: activity,
                comments: null,
                contactsList: [1],
                task: null,
                $state: {
                    current: {
                        name: undefined
                    }
                },
                contacts: {
                    current: {
                        id: undefined
                    }
                }
            };
            beforeEach(() => {
                spyOn(tasks, 'reuseTask').and.callFake(() => false);
                spyOn(tasks, 'useContacts').and.callFake(() => true);
                spyOn(tasks, 'getNames').and.callFake(() => Promise.resolve(contactList));
            });
            it('should set task activity_type to injected param', (done) => {
                tasks.getDataForAddTask(params).then((data) => {
                    expect(data.task.activity_type).toEqual(activity);
                    done();
                });
            });
            it('should get and assign contact names', (done) => {
                tasks.getDataForAddTask(params).then((data) => {
                    expect(data.contactsList).toEqual([]);
                    done();
                });
                expect(tasks.getNames).toHaveBeenCalledWith([1]);
            });
            it('should handle contacts.show state', () => {
                params.$state.current.name = 'contacts.show';
                params.contacts.current.id = 1;
                tasks.getDataForAddTask(params);
                expect(tasks.getNames).toHaveBeenCalledWith([1]);
            });
        });
        describe('follow up task', () => {
            const activity = 'Call';
            const comments = ['abc', 'def'];
            const contactsList = [{ id: 1 }];
            const task = {
                subject: 'A',
                tag_list: ['taggy']
            };
            const params = {
                activityType: activity,
                comments: comments,
                contactsList: contactsList,
                task: task,
                $state: {
                    current: {
                        name: undefined
                    }
                },
                contacts: {
                    current: {
                        id: undefined
                    }
                }
            };
            beforeEach(() => {
                spyOn(tasks, 'reuseTask').and.callFake(() => true);
                spyOn(tasks, 'useContacts').and.callFake(() => false);
                spyOn(tasks, 'mutateComments').and.callFake(() => ['a']);
                spyOn(tasks, 'getNames').and.callFake(() => Promise.resolve());
                jasmine.clock().install();
                const day = moment('2015-12-22').toDate();
                jasmine.clock().mockDate(day);
            });
            afterEach(function() {
                jasmine.clock().uninstall();
            });
            it('should create a task', (done) => {
                tasks.getDataForAddTask(params).then((data) => {
                    expect(data.task).toEqual({
                        activity_type: activity,
                        comments: ['a'],
                        start_at: moment().add(2, 'd').toISOString(),
                        subject: 'A',
                        tag_list: ['taggy']
                    });
                    done();
                });
            });
        });
    });
    describe('getNames', () => {
        it('should query an array of ids for names', () => {
            spyOn(api, 'get').and.callFake((data) => Promise.resolve(data));
            tasks.getNames([1, 2]);
            expect(api.get).toHaveBeenCalledWith({
                url: 'contacts',
                data: {
                    per_page: 10000,
                    fields: { contacts: 'name' },
                    filter: {
                        ids: '1,2',
                        status: 'active,hidden,null'
                    }
                },
                overrideGetAsPost: true,
                autoParams: false
            });
        });
    });
    describe('addModal', () => {
        beforeEach(() => {
            spyOn(serverConstants, 'load').and.callFake(() => Promise.resolve());
            spyOn(tasksTags, 'load').and.callFake(() => Promise.resolve());
            spyOn(tasks, 'getDataForAddTask').and.callFake(() => Promise.resolve());
        });
        it('should open the add modal', () => {
            spyOn(modal, 'open').and.callFake(() => {});
            tasks.addModal({});
            expect(modal.open).toHaveBeenCalledWith({
                template: require('./modals/add/add.html'),
                controller: 'addTaskController',
                resolve: {
                    tags: ['tasksTags', jasmine.any(Function)],
                    0: ['serverConstants', jasmine.any(Function)],
                    resolveObject: [ 'contacts', '$state', jasmine.any(Function) ]
                }
            });
        });
        it('should handle the resolves', () => {
            spyOn(modal, 'open').and.callThrough();
            tasks.addModal({});
            expect(tasksTags.load).toHaveBeenCalledWith();
            expect(serverConstants.load).toHaveBeenCalledWith(['activity_hashes']);
            expect(tasks.getDataForAddTask).toHaveBeenCalledWith({
                contacts: jasmine.any(Object),
                $state: jasmine.any(Object),
                contactsList: [],
                activityType: null,
                task: {},
                comments: []
            });
        });
    });
    describe('getContactsForLogModal', () => {
        let state = {
            current: {
                name: undefined
            }
        };
        let contacts = {
            current: {
                id: undefined
            }
        };
        const contactsList = [];
        beforeEach(() => {
            spyOn(tasks, 'getNames').and.callFake(() => Promise.resolve(contactList));
        });
        it('should get and assign contact names', (done) => {
            tasks.getContactsForLogModal(state, contacts, [undefined]).then((data) => {
                expect(data).toEqual([]);
                done();
            });
            expect(tasks.getNames).not.toHaveBeenCalled();
        });
        it('should handle contacts.show state', () => {
            state.current.name = 'contacts.show';
            contacts.current.id = 1;
            tasks.getContactsForLogModal(state, contacts, contactsList);
            expect(tasks.getNames).toHaveBeenCalledWith([1]);
        });
    });
});
