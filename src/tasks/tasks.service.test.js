import service from './tasks.service';

const accountListId = 123;
const currentUser = { id: 321 };

describe('tasks.service', () => {
    let api, users, tasks, tasksTags, gettextCatalog, modal, serverConstants;
    beforeEach(() => {
        angular.mock.module(service);
        inject((
            $rootScope, _api_, _tasks_, _tasksTags_, _users_, _alerts_, _gettextCatalog_, _modal_,
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
        });
        it('should open the log task modal', () => {
            spyOn(modal, 'open').and.callFake(() => {});
            tasks.logModal();
            expect(modal.open).toHaveBeenCalledWith({
                template: require('./modals/log/log.html'),
                controller: 'logTaskController',
                resolve: {
                    tags: jasmine.any(Function),
                    0: jasmine.any(Function)
                },
                locals: {
                    contactsList: []
                }
            });
        });
        it('should handle the resolves', () => {
            spyOn(modal, 'open').and.callThrough();
            tasks.logModal();
            expect(tasksTags.load).toHaveBeenCalledWith();
            expect(serverConstants.load).toHaveBeenCalledWith(['activity_hashes', 'next_actions', 'results', 'status_hashes']);
        });
    });

});
