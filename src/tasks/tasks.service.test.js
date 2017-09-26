import service from './tasks.service';
import assign from 'lodash/fp/assign';
import each from 'lodash/fp/each';
import map from 'lodash/fp/map';
import range from 'lodash/fp/range';
import unionBy from 'lodash/fp/unionBy';
import moment from 'moment';

const accountListId = 123;
const tags = [{ name: 'a' }, { name: 'b' }];
const selected = [1, 2];
const currentUser = { id: 321 };

describe('tasks.service', () => {
    let api, users, tasks, tasksTags, tasksFilter, alerts, gettextCatalog, modal, serverConstants;
    beforeEach(() => {
        angular.mock.module(service);
        inject((
            $rootScope, _api_, _tasks_, _tasksTags_, _users_, _tasksFilter_, _alerts_, _gettextCatalog_, _modal_,
            _serverConstants_
        ) => {
            api = _api_;
            alerts = _alerts_;
            modal = _modal_;
            users = _users_;
            tasks = _tasks_;
            tasksTags = _tasksTags_;
            tasksFilter = _tasksFilter_;
            gettextCatalog = _gettextCatalog_;
            serverConstants = _serverConstants_;
            api.account_list_id = accountListId;
            users.current = currentUser;
        });
        spyOn(api, 'post').and.callFake(() => Promise.resolve({ id: 1 }));
        spyOn(alerts, 'addAlert').and.callFake((data) => data);
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
            expect(tasks.data).toEqual([]);
            expect(tasks.dataLoadCount).toEqual(0);
            expect(tasks.meta).toEqual({});
            expect(tasks.page).toEqual(1);
            expect(tasks.selected).toEqual([]);
            expect(tasks.loading).toEqual(true);
        });
    });
    describe('load', () => {
        let resp = [{ id: 1, subject: 'a' }];
        let spy;
        resp.meta = { pagination: { page: 1 } };
        beforeEach(() => {
            spy = spyOn(api, 'get').and.callFake(() => Promise.resolve(resp));
        });
        it('should query the api', () => {
            tasks.load();
            expect(api.get).toHaveBeenCalledWith({
                url: 'tasks',
                data: {
                    filter: tasksFilter.toParams(),
                    page: 1,
                    per_page: 25,
                    include: 'activity_contacts,activity_contacts.contact',
                    fields: {
                        activity_contacts: 'contact',
                        contact: 'name',
                        tasks: 'activity_contacts,activity_type,completed,completed_at,no_date,starred,start_at,subject,tag_list,comments_count,location,result,notification_type,notification_time_before,notification_time_unit'
                    }
                },
                deSerializationOptions: jasmine.any(Object),
                overrideGetAsPost: true
            });
        });
        it('should set reset values on 1st page', () => {
            tasks.loading = false;
            tasks.page = 2;
            tasks.meta = { junk: 'value' };
            tasks.data = [1, 2, 3];
            tasks.dataLoadCount = 0;
            tasks.load();
            expect(tasks.loading).toEqual(true);
            expect(tasks.page).toEqual(1);
            expect(tasks.meta).toEqual({});
            expect(tasks.data).toEqual([]);
            expect(tasks.dataLoadCount).toEqual(1);
        });
        it('should handle response', (done) => {
            tasks.load().then(() => {
                expect(tasks.loading).toEqual(false);
                expect(tasks.page).toEqual(resp.meta.pagination.page);
                expect(tasks.data).toEqual([resp[0]]);
                expect(tasks.meta).toEqual(resp.meta);
                done();
            });
        });
        it('should handle pages', (done) => {
            const oldData = [{ id: 2, subject: 'b' }];
            tasks.data = oldData;
            tasks.load(2).then(() => {
                expect(tasks.page).toEqual(resp.meta.pagination.page);
                expect(tasks.data).toEqual(unionBy('id', oldData, [resp[0]]));
                done();
            });
            const args = api.get.calls.argsFor(0)[0];
            expect(args.data.page).toEqual(2);
        });
        describe('no results', () => {
            it('should call getTotalCount if no results', (done) => {
                let result = [];
                result.meta = {
                    to: 0,
                    pagination: { page: 1 }
                };
                spy.and.callFake(() => Promise.resolve(result));
                spyOn(tasks, 'getTotalCount').and.callFake(() => {});
                tasks.load().then(() => {
                    expect(tasks.getTotalCount).toHaveBeenCalled();
                    done();
                });
            });
        });
    });
    describe('process', () => {
        let task;
        beforeEach(() => {
            task = { id: 1, subject: 'a' };
        });
        it('should handle completed', () => {
            task.completed = true;
            expect(tasks.process(task).category).toEqual({ name: 'completed', id: 4 });
        });
        it('should handle today', () => {
            task.start_at = moment();
            expect(tasks.process(task).category).toEqual({ name: 'today', id: 1 });
        });
        it('should handle overdue', () => {
            task.start_at = moment().subtract(2, 'd');
            expect(tasks.process(task).category).toEqual({ name: 'overdue', id: 0 });
        });
        it('should handle upcoming', () => {
            task.start_at = moment().add(2, 'd');
            expect(tasks.process(task).category).toEqual({ name: 'upcoming', id: 2 });
        });
        it('should handle no due date', () => {
            task.start_at = null;
            expect(tasks.process(task).category).toEqual({ name: 'no-due-date', id: 3 });
        });
    });
    describe('loadMoreTasks', () => {
        beforeEach(() => {
            tasks.page = 1;
        });
        it('should load the next tasks', () => {
            spyOn(tasks, 'canLoadMoreTasks').and.callFake(() => true);
            spyOn(tasks, 'load').and.callFake(() => Promise.resolve());
            tasks.loadMoreTasks();
            expect(tasks.load).toHaveBeenCalledWith(2);
        });
        it('shouldn\'t load the next tasks', () => {
            spyOn(tasks, 'canLoadMoreTasks').and.callFake(() => false);
            spyOn(tasks, 'load').and.callFake(() => Promise.resolve());
            tasks.loadMoreTasks();
            expect(tasks.load).not.toHaveBeenCalled();
        });
    });
    describe('canLoadMoreTasks', () => {
        beforeEach(() => {
            tasks.page = 1;
            tasks.meta = {
                pagination: {
                    total_pages: 2
                }
            };
            tasks.loading = false;
        });
        it('should return true', () => {
            expect(tasks.canLoadMoreTasks()).toEqual(true);
        });
        it('should return false', () => {
            tasks.loading = true;
            expect(tasks.canLoadMoreTasks()).toEqual(false);
        });
        it('should return false', () => {
            tasks.meta.pagination.total_pages = 1;
            expect(tasks.canLoadMoreTasks()).toEqual(false);
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
    describe('bulkEdit', () => {
        beforeEach(() => {
            tasks.selected = selected;
            spyOn(api, 'put').and.callFake((url, data) => new Promise((resolve) => resolve(data)));
            spyOn(tasksTags, 'change').and.callFake(() => {});
            spyOn(tasks, 'change').and.callFake(() => {});
        });
        const model = { activity_type: 'activity' };
        it('should build a task from the provided model', (done) => {
            const result = map((id) => assign({ id: id }, model), selected);
            tasks.bulkEdit(model).then((data) => {
                expect(data).toEqual(result);
                expect(tasksTags.change).toHaveBeenCalled();
                done();
            });
            expect(api.put).toHaveBeenCalledWith('tasks/bulk', result);
        });
        it('should handle a comment', (done) => {
            const comment = 'comment';
            tasks.bulkEdit(model, comment).then((data) => {
                each((task) => {
                    expect(task.comments[0].body).toEqual(comment);
                    expect(task.comments[0].person.id).toEqual(currentUser.id);
                }, data);
                done();
            });
        });
        it('should handle tags', (done) => {
            tasks.bulkEdit(model, null, map('name', tags)).then((data) => {
                each((task) => {
                    expect(task.tag_list).toEqual('a,b');
                }, data);
                done();
            });
        });
    });
    describe('bulkDelete', () => {
        beforeEach(() => {
            tasks.selected = selected;
            spyOn(modal, 'confirm').and.callFake(() => Promise.resolve());
            spyOn(tasksTags, 'change').and.callFake(() => {});
            spyOn(tasks, 'change').and.callFake(() => {});
            spyOn(tasks, 'load').and.callFake(() => Promise.resolve());
        });
        it('should alert if over 150 selected contacts', (done) => {
            tasks.selected = range(0, 151);
            tasks.bulkDelete().catch(() => {
                expect(alerts.addAlert).toHaveBeenCalledWith(jasmine.any(String), 'danger');
                expect(gettextCatalog.getString).toHaveBeenCalledWith(jasmine.any(String));
                done();
            });
        });
        it('should confirm with a translated message', () => {
            tasks.bulkDelete();
            expect(gettextCatalog.getPlural)
                .toHaveBeenCalledWith(2, jasmine.any(String), jasmine.any(String), jasmine.any(Object));
            expect(modal.confirm).toHaveBeenCalledWith(jasmine.any(String));
        });
        it('should call delete', (done) => {
            spyOn(api, 'delete').and.callFake(() => Promise.resolve());
            tasks.bulkDelete().then(() => {
                expect(api.delete).toHaveBeenCalledWith({
                    url: 'tasks/bulk',
                    data: [{ id: 1 }, { id: 2 }],
                    type: 'tasks'
                });
                done();
            });
        });
        it('should alert a translated message', (done) => {
            spyOn(api, 'delete').and.callFake(() => Promise.resolve());
            tasks.bulkDelete().then(() => {
                expect(alerts.addAlert).toHaveBeenCalledWith(jasmine.any(String));
                expect(gettextCatalog.getPlural)
                    .toHaveBeenCalledWith(2, jasmine.any(String), jasmine.any(String), jasmine.any(Object));
                done();
            });
        });
        it('should remove the tasks from data', (done) => {
            tasks.data = [{ id: 1 }, { id: 2 }];
            spyOn(api, 'delete').and.callFake(() => Promise.resolve());
            tasks.bulkDelete().then(() => {
                expect(tasks.data).toEqual([]);
                done();
            });
        });
        it('should load tasks if all visible tasks were removed', (done) => {
            tasks.data = [{ id: 1 }, { id: 2 }];
            spyOn(api, 'delete').and.callFake(() => Promise.resolve());
            tasks.bulkDelete().then(() => {
                expect(tasks.load).toHaveBeenCalledWith();
                done();
            });
        });
        it('should unselect all tasks', (done) => {
            spyOn(api, 'delete').and.callFake(() => Promise.resolve());
            tasks.bulkDelete().then(() => {
                expect(tasks.selected).toEqual([]);
                done();
            });
        });
        it('should handle rejection', (done) => {
            spyOn(api, 'delete').and.callFake(() => Promise.reject());
            tasks.bulkDelete().catch(() => {
                expect(alerts.addAlert).toHaveBeenCalledWith(jasmine.any(String), 'danger');
                expect(gettextCatalog.getPlural)
                    .toHaveBeenCalledWith(2, jasmine.any(String), jasmine.any(String), jasmine.any(Object));
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
    describe('getTotalCount', () => {
        beforeEach(() => {
            api.account_list_id = 123;
            spyOn(api, 'get').and.callFake(() => Promise.resolve({ meta: { pagination: { total_count: 1 } } }));
        });
        it('should call the api', () => {
            tasks.getTotalCount();
            expect(api.get).toHaveBeenCalledWith('tasks', {
                filter: {
                    account_list_id: 123
                },
                per_page: 0
            });
        });
        it('should return promise', () => {
            expect(tasks.getTotalCount()).toEqual(jasmine.any(Promise));
        });
        describe('promise successful', () => {
            it('should set totalTaskCount', (done) => {
                tasks.getTotalCount().then(() => {
                    expect(tasks.totalTaskCount).toEqual(1);
                    done();
                });
            });
        });
    });
});
