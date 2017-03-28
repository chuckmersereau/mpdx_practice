class FilterController {
    tasks;
    tasksFilter;
    tasksTags;
    modal;

    constructor(
        gettextCatalog, tasksFilter, tasksTags, tasks, modal
    ) {
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
        if (this.tasksTags.isResettable()) {
            this.tasksTags.reset();
        }
        if (this.tasksFilter.isResettable()) {
            this.tasksFilter.reset();
        }
    }
    showReset() {
        return this.tasksTags.isResettable() || this.tasksFilter.isResettable();
    }
    // Invert the selected options of a multiselect filter
    invertMultiselect(filter) {
        const allOptions = _.map(filter.options, option => option.id);
        let selectedOptions = this.tasksFilter.params[filter.name];

        let allOption = '';
        if (filter.name === 'status') {
            allOption = 'active';
        }

        // If all options are selected other than 'All', then the inverse is 'All'
        if (_.isEqual(_.difference(allOptions, selectedOptions), [allOption])) {
            this.tasksFilter.params[filter.name] = [''];
            return;
        }

        selectedOptions.push(allOption); // Exclude the 'All' option when inverting
        this.tasksFilter.params[filter.name] = _.difference(allOptions, selectedOptions);
        this.tasksFilter.change();
    }
}

const Filter = {
    controller: FilterController,
    template: require('./filter.html')
};

export default angular.module('mpdx.tasks.filter.component', [])
    .component('tasksFilter', Filter).name;
