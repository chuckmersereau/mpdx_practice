import * as moment from 'moment';
import { assign, range } from 'lodash/fp';
import list, { defaultMeta } from './list.component';

const selected = [1, 2];

describe('tasks.list.component', () => {
    let $ctrl, scope, componentController, modal, tasks, api, rootScope, tasksFilter, log, tasksTags, alerts,
        gettextCatalog, users, q;

    function loadController() {
        $ctrl = componentController('tasksList', { $scope: scope }, { contact: null });
    }

    beforeEach(() => {
        angular.mock.module(list);
        inject((
            $componentController, $rootScope, _modal_, _tasks_, _api_, _tasksFilter_, $log, _tasksTags_, _alerts_,
            _gettextCatalog_, _users_, $q
        ) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            alerts = _alerts_;
            log = $log;
            tasksFilter = _tasksFilter_;
            tasksTags = _tasksTags_;
            api = _api_;
            modal = _modal_;
            tasks = _tasks_;
            users = _users_;
            gettextCatalog = _gettextCatalog_;
            q = $q;
            componentController = $componentController;
            loadController();
        });
        spyOn(log, 'debug').and.callFake(() => {});
        spyOn(alerts, 'addAlert').and.callFake((data) => data);
        spyOn(gettextCatalog, 'getString').and.callThrough();
        spyOn(gettextCatalog, 'getPlural').and.callThrough();
    });

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

        it('should default page size to 25', () => {
            expect($ctrl.pageSize).toEqual(25);
        });

        it('should set page size to user option', () => {
            users.currentOptions = {
                'page_size_tasks': { value: 10 }
            };
            loadController();
            expect($ctrl.pageSize).toEqual(10);
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
            spyOn(api, 'get').and.callFake(() => q.resolve({ meta: { pagination: { total_count: 1 } } }));
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
            expect($ctrl.getTotalCount()).toEqual(jasmine.any(q));
        });

        describe('promise successful', () => {
            it('should set totalTaskCount', (done) => {
                $ctrl.getTotalCount().then(() => {
                    expect($ctrl.totalTaskCount).toEqual(1);
                    done();
                });
                scope.$digest();
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

            afterEach(() => {
                $ctrl.$onDestroy();
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
                expect($ctrl.selectedTask).toEqual(null);
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

    describe('process', () => {
        let task;
        beforeEach(() => {
            task = { id: 1, subject: 'a' };
        });

        it('should handle completed', () => {
            task.completed = true;
            expect($ctrl.process(task).category).toEqual('completed');
        });

        it('should handle today', () => {
            task.start_at = moment();
            expect($ctrl.process(task).category).toEqual('today');
        });

        it('should handle overdue', () => {
            task.start_at = moment().subtract(2, 'd');
            expect($ctrl.process(task).category).toEqual('overdue');
        });

        it('should handle upcoming', () => {
            task.start_at = moment().add(2, 'd');
            expect($ctrl.process(task).category).toEqual('upcoming');
        });

        it('should handle no due date', () => {
            task.start_at = null;
            expect($ctrl.process(task).category).toEqual('no-date');
        });
    });

    describe('load', () => {
        let resp: any = [
            { id: 1, subject: 'a', category: { id: 2 }, completed: false, completed_at: null, start_at: null, created_at: null },
            { id: 2, subject: 'b', category: { id: 1 }, completed: true, completed_at: null, start_at: null, created_at: null },
            { id: 3, subject: 'c', category: { id: 1 }, completed: false, completed_at: null, start_at: null, created_at: null },
            { id: 4, subject: 'd', category: { id: 1 }, completed: true, completed_at: '2018-01-09T16:49:19Z', start_at: null, created_at: null },
            { id: 5, subject: 'e', category: { id: 1 }, completed: true, completed_at: '2018-02-09T16:49:19Z', start_at: null, created_at: null },
            { id: 6, subject: 'f', category: { id: 1 }, completed: true, completed_at: '2018-02-09T16:49:19Z', start_at: '2018-02-09T16:49:19Z', created_at: null },
            { id: 7, subject: 'g', category: { id: 1 }, completed: true, completed_at: '2018-02-09T16:49:19Z', start_at: '2018-03-09T16:49:19Z', created_at: null },
            { id: 8, subject: 'h', category: { id: 1 }, completed: true, completed_at: '2018-02-09T16:49:19Z', start_at: '2018-03-09T16:49:19Z', created_at: '2018-03-09T16:49:19Z' }
        ];
        let spy;
        resp.meta = { pagination: { page: 1 } };

        beforeEach(() => {
            spy = spyOn(api, 'get').and.callFake(() => q.resolve(resp));
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
                        tasks: 'activity_contacts,activity_type,completed,completed_at,no_date,contacts,starred,start_at,subject,tag_list,comments_count,location,result,notification_type,notification_time_before,notification_time_unit'
                    }
                },
                deSerializationOptions: jasmine.any(Object),
                overrideGetAsPost: true
            });
        });

        it('should set reset values', () => {
            $ctrl.loading = false;
            $ctrl.page = 2;
            $ctrl.meta = { junk: 'value' };
            $ctrl.data = [1, 2, 3];
            $ctrl.dataLoadCount = 0;
            $ctrl.load().then(() => {
                expect($ctrl.page).toEqual(1);
            });
            expect($ctrl.loading).toEqual(true);
            expect($ctrl.meta).toEqual(defaultMeta);
            expect($ctrl.data).toEqual([]);
            expect($ctrl.dataLoadCount).toEqual(1);
        });

        it('should handle response', (done) => {
            $ctrl.load().then(() => {
                expect($ctrl.loading).toEqual(false);
                expect($ctrl.page).toEqual(resp.meta.pagination.page);
                expect($ctrl.data[0]).toEqual(resp[0]);
                expect($ctrl.meta).toEqual(resp.meta);
                done();
            });
            scope.$digest();
        });

        it('should handle pages', (done) => {
            const oldData = [{ id: 9, subject: 'b' }];
            $ctrl.data = oldData;
            $ctrl.load(2).then(() => {
                expect($ctrl.page).toEqual(resp.meta.pagination.page);
                expect($ctrl.data[0]).toEqual(resp[0]);
                done();
            });
            const args = api.get.calls.argsFor(0)[0];
            expect(args.data.page).toEqual(2);
            scope.$digest();
        });

        describe('no results', () => {
            it('should call getTotalCount if no results', (done) => {
                let result: any = [];
                result.meta = {
                    to: 0,
                    pagination: { page: 1 }
                };
                spy.and.callFake(() => q.resolve(result));
                spyOn($ctrl, 'getTotalCount').and.callFake(() => {});
                $ctrl.load().then(() => {
                    expect($ctrl.getTotalCount).toHaveBeenCalled();
                    done();
                });
                scope.$digest();
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

    describe('multiSelect', () => {
        it('should select forward', () => {
            $ctrl.data = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
            $ctrl.selected = [2];
            $ctrl.lastSelectedIndex = 1;
            $ctrl.multiSelect(3);
            expect($ctrl.selected).toEqual([2, 3]);
            expect($ctrl.lastSelectedIndex).toEqual(2);
        });

        it('should select in reverse', () => {
            $ctrl.data = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
            $ctrl.selected = [3];
            $ctrl.lastSelectedIndex = 2;
            $ctrl.multiSelect(2);
            expect($ctrl.selected).toEqual([2, 3]);
            expect($ctrl.lastSelectedIndex).toEqual(1);
        });
    });

    describe('selectAll', () => {
        beforeEach(() => {
            spyOn($ctrl, 'getList').and.callFake(() => q.resolve());
        });

        it('should select all', (done) => {
            $ctrl.completeList = [{ id: 1 }, { id: 2 }, { id: 3 }];
            $ctrl.data = [{ id: 1 }, { id: 2 }];
            $ctrl.selectAll().then(() => {
                expect($ctrl.selected).toEqual([1, 2, 3]);
                done();
            });
            scope.$digest();
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
            spyOn($ctrl, 'getList').and.callFake(() => q.resolve());
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
            spyOn(api, 'get').and.callFake(() => q.resolve([{ id: 2 }]));
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
            scope.$digest();
        });
    });

    describe('bulkComplete', () => {
        it('should call api', (done) => {
            spyOn(api, 'put').and.callFake(() => q.resolve());
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
            scope.$digest();
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
            spyOn(modal, 'confirm').and.callFake(() => q.resolve());
            spyOn(tasksTags, 'change').and.callFake(() => {});
            spyOn(tasks, 'change').and.callFake(() => {});
            spyOn(rootScope, '$emit').and.callFake(() => {});
        });

        it('should alert if over 150 selected contacts', (done) => {
            const selected = range(0, 151);
            $ctrl.bulkDelete(selected).catch(() => {
                expect(alerts.addAlert).toHaveBeenCalledWith(jasmine.any(String), 'danger');
                expect(gettextCatalog.getString).toHaveBeenCalledWith('Too many tasks selected, please select a maximum of 150 tasks.');
                done();
            });
            scope.$digest();
        });

        it('should confirm with a translated message', () => {
            $ctrl.bulkDelete(selected);
            expect(gettextCatalog.getPlural)
                .toHaveBeenCalledWith(2, 'Are you sure you wish to delete the selected task?',
                    'Are you sure you wish to delete the {{$count}} selected tasks?', { $count: 2 });
            expect(modal.confirm).toHaveBeenCalledWith(jasmine.any(String));
        });

        it('should call delete', (done) => {
            spyOn(api, 'delete').and.callFake(() => q.resolve());
            $ctrl.bulkDelete(selected).then(() => {
                expect(api.delete).toHaveBeenCalledWith({
                    url: 'tasks/bulk',
                    data: [{ id: 1 }, { id: 2 }],
                    type: 'tasks',
                    autoParams: false,
                    successMessage: '2 tasks successfully removed.',
                    errorMessage: 'Unable to delete the 2 selected tasks.'
                });
                expect(gettextCatalog.getPlural)
                    .toHaveBeenCalledWith(2, '1 task successfully removed.',
                        '{{$count}} tasks successfully removed.', { $count: 2 });
                expect(gettextCatalog.getPlural)
                    .toHaveBeenCalledWith(2, 'Unable to delete the selected task.',
                        'Unable to delete the {{$count}} selected tasks.', { $count: 2 });
                done();
            });
            scope.$digest();
        });

        it('should call tasksDeleted', (done) => {
            spyOn(api, 'delete').and.callFake(() => q.resolve());
            $ctrl.bulkDelete(selected).then(() => {
                expect(rootScope.$emit).toHaveBeenCalledWith('tasksDeleted', [{ id: 1 }, { id: 2 }]);
                done();
            });
            scope.$digest();
        });
    });

    describe('pageSizeChange', () => {
        it('should change pageSize', () => {
            $ctrl.pageSizeChange(50);
            expect($ctrl.pageSize).toEqual(50);
        });

        it('should reload the 1st page', () => {
            spyOn($ctrl, 'load').and.callFake(() => {});
            $ctrl.pageSizeChange(50);
            expect($ctrl.load).toHaveBeenCalledWith(1);
        });
    });

    describe('openAddTagModal', () => {
        it('should open the add tag modal', () => {
            spyOn(modal, 'open').and.callFake(() => {});
            $ctrl.openAddTagModal([1, 2]);
            expect(modal.open).toHaveBeenCalledWith({
                template: require('../filter/tags/add/add.html'),
                controller: 'addTaskTagController',
                locals: {
                    selectedTasks: [1, 2]
                }
            });
        });
    });
});