class FilterController {
    constructor(
        $scope,
        filters, gettextCatalog, modal, tasksFilter, tasksTags, tasks
    ) {
        this.$scope = $scope;
        this.filters = filters;
        this.modal = modal;
        this.tasks = tasks;
        this.tasksFilter = tasksFilter;
        this.gettextCatalog = gettextCatalog;
        this.tasksTags = tasksTags;

        this.dateRangeLocale = {
            applyLabel: this.gettextCatalog.getString('Filter'),
            cancelLabel: this.gettextCatalog.getString('Clear')
        };

        this.selectedSort = 'all';
    }
    resetFiltersAndTags() {
        this.tasksFilter.reset();
    }
}

const Filter = {
    controller: FilterController,
    template: require('./filter.html')
};

import filters from 'common/filters/filters.service';
import gettext from 'angular-gettext';
import modal from 'common/modal/modal.service';
import tasks from 'tasks/tasks.service';
import tasksFilter from './filter.service';

export default angular.module('mpdx.tasks.filter.component', [
    gettext,
    filters, modal, tasks, tasksFilter
]).component('tasksFilter', Filter).name;
