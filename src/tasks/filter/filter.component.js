class FilterController {
    tasks;
    tasksFilter;
    tasksTags;
    modal;

    constructor(
        filters, gettextCatalog, modal, tasksFilter, tasksTags, tasks
    ) {
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
    }
    resetFiltersAndTags() {
        this.tasksFilter.reset();
    }
    showReset() {
        return this.tasksTags.isResettable() || this.tasksFilter.isResettable();
    }
    // Invert the selected options of a multiselect filter
    invertMultiselect(filter) {
        this.tasksFilter.params[filter.name] = this.filters.invertMultiselect(filter, this.tasksFilter.params);
        this.tasksFilter.change();
    }
}

const Filter = {
    controller: FilterController,
    template: require('./filter.html')
};

export default angular.module('mpdx.tasks.filter.component', [])
    .component('tasksFilter', Filter).name;
