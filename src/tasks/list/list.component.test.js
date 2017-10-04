import list from './list.component';
import assign from 'lodash/fp/assign';
import range from 'lodash/fp/range';
import moment from 'moment';
import unionBy from 'lodash/fp/unionBy';

const selected = [1, 2];

describe('tasks.list.component', () => {
    let $ctrl, scope, componentController, modal, tasks, api, rootScope, tasksFilter, log, tasksTags, alerts,
        gettextCatalog;
    beforeEach(() => {
        angular.mock.module(list);
        inject((
            $componentController, $rootScope, _modal_, _tasks_, _api_, _tasksFilter_, $log, _tasksTags_, _alerts_,
            _gettextCatalog_
        ) => {
            rootScope = $rootScope;
            scope = $rootScope.$new();
            alerts = _alerts_;
            log = $log;
            tasksFilter = _tasksFilter_;
            tasksTags = _tasksTags_;
            api = _api_;
            modal = _modal_;
            tasks = _tasks_;
            gettextCatalog = _gettextCatalog_;
            componentController = $componentController;
            loadController();
        });
        spyOn(log, 'debug').and.callFake(() => {});
        spyOn(alerts, 'addAlert').and.callFake((data) => data);
        spyOn(gettextCatalog, 'getString').and.callThrough();
        spyOn(gettextCatalog, 'getPlural').and.callThrough();
    });

    function loadController() {
        $ctrl = componentController('tasksList', { $scope: scope }, { contact: null });
    }
    describe('constructor', () => {
        it('should set default values', () => {
            expect($ctrl.data).toEqual([]);
            expect($ctrl.dataLoadCount).toEqual(0);
            expect($ctrl.meta).toEqual({
                pagination: {
                    total_count: 0
                }
            });
            expect($ctrl.page).toEqual(1);
            expect($ctrl.selected).toEqual([]);
            expect($ctrl.loading).toEqual(false);
            expect($ctrl.totalTaskCount).toEqual(0);
        });
    });
    describe('openRemoveTagModal', () => {
        beforeEach(() => {
            spyOn(modal, 'open').and.callFake(() => {});
            spyOn($ctrl, 'getSelectedTasks').and.callFake(() => ['1']);
        });
        it('should open the remove tag modal', () => {
            $ctrl.openRemoveTagModal();
            expect(modal.open).toHaveBeenCalledWith({
                template: require('../modals/removeTags/removeTags.html'),
                controller: 'removeTaskTagController',
                locals: {
                    selectedTasks: $ctrl.getSelectedTasks(),
                    currentListSize: $ctrl.data.length
                }
            });
        });
    });
    describe('getSelectedTasks', () => {
        it('should get tasks for selected ids', () => {
            $ctrl.selected = [1, 2];
            $ctrl.data = [{ id: 1, name: 'a' }, { id: 2, name: 'b' }];
            expect($ctrl.getSelectedTasks()).toEqual($ctrl.data);
        });
    });
    describe('getTotalCount', () => {
        beforeEach(() => {
            api.account_list_id = 123;
            spyOn(api, 'get').and.callFake(() => Promise.resolve({ meta: { pagination: { total_count: 1 } } }));
        });
        it('should call the api', () => {
            $ctrl.getTotalCount();
            expect(api.get).toHaveBeenCalledWith('tasks', {
                filter: {
                    account_list_id: 123
                },
                per_page: 0
            });
        });
        it('should return promise', () => {
            expect($ctrl.getTotalCount()).toEqual(jasmine.any(Promise));
        });
        describe('promise successful', () => {
            it('should set totalTaskCount', (done) => {
                $ctrl.getTotalCount().then(() => {
                    expect($ctrl.totalTaskCount).toEqual(1);
                    done();
                });
            });
        });
    });
    describe('$onInit', () => {
        it('should call load', () => {
            spyOn($ctrl, 'load').and.callFake(() => {});
            $ctrl.$onInit();
            expect($ctrl.load).toHaveBeenCalledWith();
            $ctrl.$onDestroy();
        });
    });
    describe('$onChanges', () => {
        it('should call load', () => {
            spyOn($ctrl, 'reset').and.callFake(() => {});
            $ctrl.$onChanges();
            expect($ctrl.reset).toHaveBeenCalledWith();
        });
    });
    describe('events', () => {
        beforeEach(() => {
            $ctrl.selected = [1, 2];
            spyOn($ctrl, 'load').and.callFake(() => {});
            spyOn($ctrl, 'reset').and.callFake(() => {});
            spyOn($ctrl, 'process').and.callFake((data) => assign(data, { processed: true }));
            $ctrl.$onInit();
        });
        afterEach(() => {
            $ctrl.$onDestroy();
        });
        describe('taskChange', () => {
            it('should reload tasks', () => {
                rootScope.$emit('taskChange');
                rootScope.$digest();
                expect($ctrl.load).toHaveBeenCalledWith();
            });
        });
        describe('tasksFilterChange', () => {
            it('should reload tasks', () => {
                rootScope.$emit('tasksFilterChange');
                rootScope.$digest();
                expect($ctrl.load).toHaveBeenCalledWith();
            });
        });
        describe('tasksTagsChanged', () => {
            it('should reload tasks', () => {
                rootScope.$emit('tasksTagsChanged');
                rootScope.$digest();
                expect($ctrl.reset).toHaveBeenCalledWith();
            });
        });
        describe('taskCreated', () => {
            beforeEach(() => {
                $ctrl.totalTaskCount = 0;
            });
            it('should add a processed task', () => {
                rootScope.$emit('taskCreated', { id: 1 });
                rootScope.$digest();
                expect($ctrl.data).toEqual([{ id: 1, processed: true }]);
            });
            it('should reload current page', () => {
                $ctrl.page = 2;
                rootScope.$emit('taskCreated', { id: 1 });
                rootScope.$digest();
                expect($ctrl.load).toHaveBeenCalledWith(2);
            });
            it('should add to totalTaskCount', () => {
                $ctrl.page = 2;
                rootScope.$emit('taskCreated', { id: 1 });
                rootScope.$digest();
                expect($ctrl.totalTaskCount).toEqual(1);
            });
        });
        describe('taskDeleted', () => {
            beforeEach(() => {
                $ctrl.data = [{ id: 1 }, { id: 2 }];
                $ctrl.totalTaskCount = 2;
                $ctrl.meta.pagination.total_count = 2;
            });
            it('should remove the tasks from data', () => {
                rootScope.$emit('taskDeleted', 1);
                rootScope.$digest();
                expect($ctrl.data).toEqual([{ id: 2 }]);
                expect($ctrl.selected).toEqual([2]);
                expect($ctrl.totalTaskCount).toEqual(1);
                expect($ctrl.meta.pagination.total_count).toEqual(1);
            });
        });
        describe('tasksDeleted', () => {
            beforeEach(() => {
                $ctrl.selected = [1, 2];
                $ctrl.data = [{ id: 1 }, { id: 2 }];
                $ctrl.$onInit();
            });
            it('should remove the tasks from data', () => {
                rootScope.$emit('tasksDeleted', [{ id: 1 }]);
                rootScope.$digest();
                expect($ctrl.data).toEqual([{ id: 2 }]);
            });
            it('should load tasks if all visible tasks were removed', () => {
                rootScope.$emit('tasksDeleted', [{ id: 1 }, { id: 2 }]);
                rootScope.$digest();
                expect($ctrl.load).toHaveBeenCalledWith();
            });
            it('should unselect all tasks', () => {
                rootScope.$emit('tasksDeleted', [{ id: 1 }, { id: 2 }]);
                rootScope.$digest();
                expect($ctrl.selected).toEqual([]);
            });
        });
        describe('accountListReset', () => {
            it('should reset stuff', () => {
                spyOn(tasksFilter, 'reset').and.callFake(() => {});
                spyOn(tasksFilter, 'load').and.callFake(() => {});
                spyOn(tasksTags, 'load').and.callFake(() => {});
                rootScope.$emit('accountListUpdated');
                rootScope.$digest();
                expect(tasksFilter.reset).toHaveBeenCalledWith();
                expect(tasksFilter.load).toHaveBeenCalledWith(true);
                expect(tasksTags.load).toHaveBeenCalledWith(true);
                expect($ctrl.reset).toHaveBeenCalledWith();
            });
        });
    });
    describe('$onDestroy', () => {
        beforeEach(() => {
            $ctrl.$onInit();
        });
        it('should kill watchers', () => {
            spyOn($ctrl, 'watcher').and.callFake(() => {});
            spyOn($ctrl, 'watcher2').and.callFake(() => {});
            spyOn($ctrl, 'watcher3').and.callFake(() => {});
            spyOn($ctrl, 'watcher4').and.callFake(() => {});
            spyOn($ctrl, 'watcher5').and.callFake(() => {});
            spyOn($ctrl, 'watcher6').and.callFake(() => {});
            spyOn($ctrl, 'watcher7').and.callFake(() => {});
            $ctrl.$onDestroy();
            expect($ctrl.watcher).toHaveBeenCalledWith();
            expect($ctrl.watcher2).toHaveBeenCalledWith();
            expect($ctrl.watcher3).toHaveBeenCalledWith();
            expect($ctrl.watcher4).toHaveBeenCalledWith();
            expect($ctrl.watcher5).toHaveBeenCalledWith();
            expect($ctrl.watcher6).toHaveBeenCalledWith();
            expect($ctrl.watcher7).toHaveBeenCalledWith();
        });
    });
    describe('canLoadMoreTasks', () => {
        beforeEach(() => {
            $ctrl.page = 1;
            $ctrl.meta = {
                pagination: {
                    total_pages: 2
                }
            };
            $ctrl.loading = false;
        });
        it('should return true', () => {
            expect($ctrl.canLoadMoreTasks()).toEqual(true);
        });
        it('should return false', () => {
            $ctrl.loading = true;
            expect($ctrl.canLoadMoreTasks()).toEqual(false);
        });
        it('should return false', () => {
            $ctrl.meta.pagination.total_pages = 1;
            expect($ctrl.canLoadMoreTasks()).toEqual(false);
        });
    });
    describe('loadMoreTasks', () => {
        beforeEach(() => {
            $ctrl.page = 1;
        });
        it('should load the next tasks', () => {
            spyOn($ctrl, 'canLoadMoreTasks').and.callFake(() => true);
            spyOn($ctrl, 'load').and.callFake(() => Promise.resolve());
            $ctrl.loadMoreTasks();
            expect($ctrl.load).toHaveBeenCalledWith(2);
        });
        it('shouldn\'t load the next tasks', () => {
            spyOn($ctrl, 'canLoadMoreTasks').and.callFake(() => false);
            spyOn($ctrl, 'load').and.callFake(() => Promise.resolve());
            $ctrl.loadMoreTasks();
            expect($ctrl.load).not.toHaveBeenCalled();
        });
    });
    describe('process', () => {
        let task;
        beforeEach(() => {
            task = { id: 1, subject: 'a' };
        });
        it('should handle completed', () => {
            task.completed = true;
            expect($ctrl.process(task).category).toEqual({ name: 'completed', id: 4 });
        });
        it('should handle today', () => {
            task.start_at = moment();
            expect($ctrl.process(task).category).toEqual({ name: 'today', id: 1 });
        });
        it('should handle overdue', () => {
            task.start_at = moment().subtract(2, 'd');
            expect($ctrl.process(task).category).toEqual({ name: 'overdue', id: 0 });
        });
        it('should handle upcoming', () => {
            task.start_at = moment().add(2, 'd');
            expect($ctrl.process(task).category).toEqual({ name: 'upcoming', id: 2 });
        });
        it('should handle no due date', () => {
            task.start_at = null;
            expect($ctrl.process(task).category).toEqual({ name: 'no-due-date', id: 3 });
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
            $ctrl.load();
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
            $ctrl.loading = false;
            $ctrl.page = 2;
            $ctrl.meta = { junk: 'value' };
            $ctrl.data = [1, 2, 3];
            $ctrl.dataLoadCount = 0;
            $ctrl.load();
            expect($ctrl.loading).toEqual(true);
            expect($ctrl.page).toEqual(1);
            expect($ctrl.meta).toEqual({});
            expect($ctrl.data).toEqual([]);
            expect($ctrl.dataLoadCount).toEqual(1);
        });
        it('should handle response', (done) => {
            $ctrl.load().then(() => {
                expect($ctrl.loading).toEqual(false);
                expect($ctrl.page).toEqual(resp.meta.pagination.page);
                expect($ctrl.data).toEqual([resp[0]]);
                expect($ctrl.meta).toEqual(resp.meta);
                done();
            });
        });
        it('should handle pages', (done) => {
            const oldData = [{ id: 2, subject: 'b' }];
            $ctrl.data = oldData;
            $ctrl.load(2).then(() => {
                expect($ctrl.page).toEqual(resp.meta.pagination.page);
                expect($ctrl.data).toEqual(unionBy('id', oldData, [resp[0]]));
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
                spyOn($ctrl, 'getTotalCount').and.callFake(() => {});
                $ctrl.load().then(() => {
                    expect($ctrl.getTotalCount).toHaveBeenCalled();
                    done();
                });
            });
        });
    });
    describe('clearSelected', () => {
        it('should clear selected tasks', () => {
            $ctrl.selected = [1, 2];
            $ctrl.clearSelected();
            expect($ctrl.selected).toEqual([]);
        });
    });
    describe('isSelected', () => {
        it('should be true', () => {
            $ctrl.selected = [1, 2];
            expect($ctrl.isSelected(2)).toBeTruthy();
        });
        it('should be false', () => {
            $ctrl.selected = [1, 2];
            expect($ctrl.isSelected(3)).toBeFalsy();
        });
    });
    describe('select', () => {
        it('should select', () => {
            $ctrl.selected = [1, 2];
            $ctrl.select(3);
            expect($ctrl.selected).toEqual([3, 1, 2]);
        });
        it('should deselect', () => {
            $ctrl.selected = [1, 2];
            $ctrl.select(2);
            expect($ctrl.selected).toEqual([1]);
        });
    });
    describe('selectAll', () => {
        beforeEach(() => {
            spyOn($ctrl, 'getList').and.callFake(() => Promise.resolve());
        });
        it('should select all', (done) => {
            $ctrl.completeList = [{ id: 1 }, { id: 2 }, { id: 3 }];
            $ctrl.data = [{ id: 1 }, { id: 2 }];
            $ctrl.selectAll().then(() => {
                expect($ctrl.selected).toEqual([1, 2, 3]);
                done();
            });
        });
        it('should select data', () => {
            $ctrl.selected = [];
            $ctrl.data = [{ id: 1 }, { id: 2 }];
            $ctrl.selectAll(false);
            expect($ctrl.selected).toEqual([1, 2]);
        });
    });
    describe('toggleAll', () => {
        beforeEach(() => {
            spyOn($ctrl, 'getList').and.callFake(() => Promise.resolve());
        });
        it('should clear selected', () => {
            $ctrl.selected = [1, 2, 3];
            $ctrl.data = [{ id: 1 }, { id: 2 }];
            $ctrl.toggleAll();
            expect($ctrl.selected).toEqual([]);
        });
        it('should call select all', () => {
            spyOn($ctrl, 'selectAll').and.callFake(() => [1, 2]);
            $ctrl.selected = [];
            $ctrl.data = [{ id: 1 }, { id: 2 }];
            $ctrl.toggleAll();
            expect($ctrl.selectAll).toHaveBeenCalledWith(false);
        });
    });
    describe('getList', () => {
        beforeEach(() => {
            spyOn(api, 'get').and.callFake(() => Promise.resolve([{ id: 2 }]));
            spyOn(tasksFilter, 'toParams').and.callFake(() => 'a');
        });
        it('should empty completeList', () => {
            $ctrl.getList();
            expect($ctrl.completeList).toEqual([]);
        });
        it('should call the api', () => {
            $ctrl.getList();
            expect(api.get).toHaveBeenCalledWith({
                url: 'tasks',
                data: {
                    filter: 'a',
                    fields: {
                        tasks: 'subject'
                    },
                    per_page: 25000
                },
                overrideGetAsPost: true
            });
        });
        it('should set completeList', (done) => {
            $ctrl.getList().then(() => {
                expect($ctrl.completeList).toEqual([{ id: 2 }]);
                done();
            });
        });
    });
    describe('bulkComplete', () => {
        it('should call api', (done) => {
            spyOn(api, 'put').and.callFake(() => Promise.resolve());
            $ctrl.data = [{ id: 1 }, { id: 2 }];
            $ctrl.selected = selected;
            $ctrl.bulkComplete().then(() => {
                expect(api.put).toHaveBeenCalledWith('tasks/bulk', [
                    { id: 1, completed: true },
                    { id: 2, completed: true }
                ]);
                expect($ctrl.data).toEqual([
                    { id: 1, completed: true, category: 'completed' },
                    { id: 2, completed: true, category: 'completed' }
                ]);
                done();
            });
        });
    });
    describe('reset', () => {
        it('should reset selected', () => {
            $ctrl.selected = [1, 2];
            $ctrl.reset();
            expect($ctrl.selected).toEqual([]);
        });
        it('should emit taskChange', () => {
            $ctrl.selected = [1, 2];
            spyOn(rootScope, '$emit').and.callFake(() => {});
            $ctrl.reset();
            expect(rootScope.$emit).toHaveBeenCalledWith('taskChange');
        });
    });
    describe('bulkDelete', () => {
        beforeEach(() => {
            spyOn(modal, 'confirm').and.callFake(() => Promise.resolve());
            spyOn(tasksTags, 'change').and.callFake(() => {});
            spyOn(tasks, 'change').and.callFake(() => {});
            spyOn(rootScope, '$emit').and.callFake(() => {});
        });
        it('should alert if over 150 selected contacts', (done) => {
            const selected = range(0, 151);
            $ctrl.bulkDelete(selected).catch(() => {
                expect(alerts.addAlert).toHaveBeenCalledWith(jasmine.any(String), 'danger');
                expect(gettextCatalog.getString).toHaveBeenCalledWith(jasmine.any(String));
                done();
            });
        });
        it('should confirm with a translated message', () => {
            $ctrl.bulkDelete(selected);
            expect(gettextCatalog.getPlural)
                .toHaveBeenCalledWith(2, jasmine.any(String), jasmine.any(String), jasmine.any(Object));
            expect(modal.confirm).toHaveBeenCalledWith(jasmine.any(String));
        });
        it('should call delete', (done) => {
            spyOn(api, 'delete').and.callFake(() => Promise.resolve());
            $ctrl.bulkDelete(selected).then(() => {
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
            $ctrl.bulkDelete(selected).then(() => {
                expect(alerts.addAlert).toHaveBeenCalledWith(jasmine.any(String));
                expect(gettextCatalog.getPlural)
                    .toHaveBeenCalledWith(2, jasmine.any(String), jasmine.any(String), jasmine.any(Object));
                done();
            });
        });
        it('should call tasksDeleted', (done) => {
            spyOn(api, 'delete').and.callFake(() => Promise.resolve());
            $ctrl.bulkDelete(selected).then(() => {
                expect(rootScope.$emit).toHaveBeenCalledWith('tasksDeleted', [{ id: 1 }, { id: 2 }]);
                done();
            });
        });
        it('should handle rejection', (done) => {
            spyOn(api, 'delete').and.callFake(() => Promise.reject());
            $ctrl.bulkDelete(selected).catch(() => {
                expect(alerts.addAlert).toHaveBeenCalledWith(jasmine.any(String), 'danger');
                expect(gettextCatalog.getPlural)
                    .toHaveBeenCalledWith(2, jasmine.any(String), jasmine.any(String), jasmine.any(Object));
                done();
            });
        });
    });
});