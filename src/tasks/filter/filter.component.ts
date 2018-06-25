import 'angular-gettext';
import { assign, isNil } from 'lodash/fp';
import { stringToNameObjectArray } from '../../common/fp/tags';
import { TasksTagsService } from './tags/tags.service';
import { UsersService } from '../../common/users/users.service';
import filters, { FiltersService } from '../../common/filters/filters.service';
import modal, { ModalService } from '../../common/modal/modal.service';
import session, { SessionService } from '../../common/session/session.service';
import tasks, { TasksService } from '../tasks.service';
import tasksFilter, { TasksFilterService } from './filter.service';

class FilterController {
    activeFilters: any[];
    dateRangeLocale: any;
    isCollapsed: boolean;
    selectedSort: string;
    watcher: () => void;
    watcher2: () => void;
    constructor(
        private $rootScope: ng.IRootScopeService,
        private $scope: ng.IScope,
        private filters: FiltersService,
        private gettextCatalog: ng.gettext.gettextCatalog,
        private modal: ModalService,
        private session: SessionService,
        private tasksFilter: TasksFilterService,
        private tasksTags: TasksTagsService,
        private tasks: TasksService,
        private users: UsersService
    ) {
        this.dateRangeLocale = {
            applyLabel: this.gettextCatalog.getString('Filter'),
            cancelLabel: this.gettextCatalog.getString('Clear')
        };

        this.selectedSort = 'all';
        this.activeFilters = [];
    }
    $onInit() {
        this.isCollapsed = this.users.getCurrentOptionValue('tasks_filters_collapse');
        this.watcher = this.$scope.$watch('$ctrl.isCollapsed', (newVal) => {
            if (!isNil(newVal)) {
                this.users.saveOption('tasks_filters_collapse', this.isCollapsed);
            }
        });
        this.watcher2 = this.$rootScope.$on('accountListUpdated', () => {
            this.selectedSort = 'all';
        });
    }
    $onDestroy() {
        this.watcher();
        this.watcher2();
    }
    useSavedFilter(name) {
        const option = this.users.getCurrentOptionValue(`saved_tasks_filter_${name}`);
        const value = JSON.parse(option);
        const params = this.filters.fromStrings(value.params, this.tasksFilter.data);
        this.tasksFilter.assignDefaultParamsAndGroup('all');
        this.tasksFilter.params = assign(this.tasksFilter.defaultParams, params);
        this.tasksFilter.wildcardSearch = value.wildcard_search;
        this.tasksTags.anyTags = value.any_tags;
        this.tasksTags.rejectedTags = stringToNameObjectArray(value.exclude_tags);
        this.tasksTags.selectedTags = stringToNameObjectArray(value.tags);
        this.tasksFilter.change();
        this.tasksFilter.selectedSave = name;
    }
    resetFiltersAndTags() {
        this.tasksFilter.reset();
    }
    openSaveModal() {
        this.modal.open({
            controller: 'saveFilterModal',
            template: require('../../common/filters/save/save.html'),
            locals: {
                anyTags: this.tasksTags.anyTags,
                filterType: 'tasks',
                params: this.tasksFilter.params,
                rejectedTags: this.tasksTags.rejectedTags,
                selectedTags: this.tasksTags.selectedTags,
                wildcardSearch: this.tasksFilter.wildcardSearch
            }
        });
    }
}

const Filter = {
    controller: FilterController,
    template: require('./filter.html')
};

export default angular.module('mpdx.tasks.filter.component', [
    'gettext',
    filters, modal, session, tasks, tasksFilter
]).component('tasksFilter', Filter).name;
