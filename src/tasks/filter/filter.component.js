import { assign } from 'lodash/fp';
import { stringToNameObjectArray } from 'common/fp/tags';

class FilterController {
    constructor(
        $scope,
        filters, gettextCatalog, modal, tasksFilter, tasksTags, tasks, users
    ) {
        this.$scope = $scope;
        this.filters = filters;
        this.modal = modal;
        this.tasks = tasks;
        this.tasksFilter = tasksFilter;
        this.gettextCatalog = gettextCatalog;
        this.tasksTags = tasksTags;
        this.users = users;

        this.dateRangeLocale = {
            applyLabel: this.gettextCatalog.getString('Filter'),
            cancelLabel: this.gettextCatalog.getString('Clear')
        };

        this.selectedSort = 'all';
    }
    useSavedFilter(name) {
        const option = this.users.getCurrentOptionValue(`saved_tasks_filter_${name}`);
        const value = JSON.parse(option);
        const params = this.filters.fromStrings(value.params, this.tasksFilter.data);
        this.tasksFilter.assignDefaultParamsAndGroup('all');
        this.tasksFilter.params = assign(this.tasksFilter.defaultParams, params);
        this.tasksFilter.wildcard_search = value.wildcard_search;
        this.tasksTags.any_tags = value.any_tags;
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
                anyTags: this.tasksTags.any_tags,
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

import filters from 'common/filters/filters.service';
import gettext from 'angular-gettext';
import modal from 'common/modal/modal.service';
import tasks from 'tasks/tasks.service';
import tasksFilter from './filter.service';

export default angular.module('mpdx.tasks.filter.component', [
    gettext,
    filters, modal, tasks, tasksFilter
]).component('tasksFilter', Filter).name;
