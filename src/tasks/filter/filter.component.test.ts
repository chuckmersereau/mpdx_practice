import { assign } from 'lodash/fp';
import component from './filter.component';

const accountListId = 123;
const name = 'my_filter';
const key = `saved_tasks_filter_${name}`;
const obj = {
    account_list_id: accountListId,
    any_tags: true,
    exclude_tags: 'home,alone',
    params: {
        activity_type: 'Call'
    },
    tags: 'fun,tonight',
    wildcard_search: 'a'
};
const options = {
    [key]: { key: key, title: key, value: JSON.stringify(obj) }
};
describe('tasks.filter.component', () => {
    let $ctrl, rootScope, scope, api, users, tasksFilter, tasksTags, modal, q;

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _api_, _users_, _tasksFilter_, _tasksTags_, _modal_, $q) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            api = _api_;
            modal = _modal_;
            tasksFilter = _tasksFilter_;
            tasksTags = _tasksTags_;
            users = _users_;
            q = $q;
            $ctrl = $componentController('tasksFilter', { $scope: scope }, {});
        });
        api.account_list_id = accountListId;
    });

    describe('constructor', () => {
        it('should do something', () => {
            expect($ctrl.selectedSort).toEqual('all');
        });
    });

    describe('$onInit', () => {
        beforeEach(() => {
            spyOn(users, 'getCurrentOptionValue').and.callFake(() => true);
            spyOn(users, 'saveOption').and.callFake(() => q.resolve());
        });

        afterEach(() => {
            $ctrl.$onDestroy();
        });

        it('should set isCollapsed', () => {
            $ctrl.$onInit();
            expect($ctrl.isCollapsed).toBeTruthy();
        });

        it('should handle isCollapsed changing', () => {
            $ctrl.$onInit();
            $ctrl.isCollapsed = false;
            rootScope.$digest();
            expect(users.saveOption).toHaveBeenCalledWith('tasks_filters_collapse', false);
        });

        it('should reset selectedSort on accountList change', () => {
            $ctrl.$onInit();
            $ctrl.selectedSort = 'a';
            rootScope.$emit('accountListUpdated');
            rootScope.$digest();
            expect($ctrl.selectedSort).toEqual('all');
        });
    });

    describe('$onDestroy', () => {
        it('should clear watchers', () => {
            $ctrl.$onInit();
            spyOn($ctrl, 'watcher').and.callFake(() => {});
            spyOn($ctrl, 'watcher2').and.callFake(() => {});
            $ctrl.$onDestroy();
            expect($ctrl.watcher).toHaveBeenCalledWith();
            expect($ctrl.watcher2).toHaveBeenCalledWith();
        });
    });

    describe('useSavedFilter', () => {
        beforeEach(() => {
            users.currentOptions = options;
            spyOn(tasksFilter, 'assignDefaultParamsAndGroup').and.callThrough();
            spyOn(tasksFilter, 'change').and.callFake(() => {});
        });

        it('should set filter defaults', () => {
            $ctrl.useSavedFilter(name);
            expect(tasksFilter.assignDefaultParamsAndGroup).toHaveBeenCalledWith('all');
        });

        it('should set filter params over defaults', () => {
            $ctrl.useSavedFilter(name);
            expect(tasksFilter.params).toEqual(assign(tasksFilter.defaultParams, obj.params));
        });

        it('should set wildcard search', () => {
            $ctrl.useSavedFilter(name);
            expect(tasksFilter.wildcardSearch).toEqual(obj.wildcard_search);
        });

        it('should set any_tags', () => {
            $ctrl.useSavedFilter(name);
            expect(tasksTags.anyTags).toBeTruthy();
        });

        it('should set rejectedTags', () => {
            $ctrl.useSavedFilter(name);
            expect(tasksTags.rejectedTags).toEqual([{ name: 'home' }, { name: 'alone' }]);
        });

        it('should set selectedTags', () => {
            $ctrl.useSavedFilter(name);
            expect(tasksTags.selectedTags).toEqual([{ name: 'fun' }, { name: 'tonight' }]);
        });

        it('should trigger filter change', () => {
            $ctrl.useSavedFilter(name);
            expect(tasksFilter.change).toHaveBeenCalledWith();
        });

        it('should set selectedSave', () => {
            $ctrl.useSavedFilter(name);
            expect(tasksFilter.selectedSave).toEqual(name);
        });
    });

    describe('resetFiltersAndTags', () => {
        it('should trigger filter service reset', () => {
            spyOn(tasksFilter, 'reset').and.callFake(() => {});
            $ctrl.resetFiltersAndTags();
            expect(tasksFilter.reset).toHaveBeenCalledWith();
        });
    });

    describe('openSaveModal', () => {
        it('should open the save modal', () => {
            spyOn(modal, 'open').and.callFake(() => q.resolve());
            $ctrl.openSaveModal();
            expect(modal.open).toHaveBeenCalledWith({
                controller: 'saveFilterModal',
                template: require('../../common/filters/save/save.html'),
                locals: {
                    anyTags: tasksTags.anyTags,
                    filterType: 'tasks',
                    params: tasksFilter.params,
                    rejectedTags: tasksTags.rejectedTags,
                    selectedTags: tasksTags.selectedTags,
                    wildcardSearch: tasksFilter.wildcardSearch
                }
            });
        });
    });
});