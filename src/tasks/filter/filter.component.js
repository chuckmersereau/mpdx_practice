class FilterController {
    tasksService;
    tasksFilter;
    tasksTags;
    modal;

    constructor($stateParams, tasksFilter, tasksTags, tasksService, modal, gettextCatalog) {
        this.modal = modal;
        this.tasksService = tasksService;
        this.tasksFilter = tasksFilter;
        this.gettextCatalog = gettextCatalog;
        this.tasksTags = tasksTags;

        this.dateRangeLocale = {
            applyLabel: this.gettextCatalog.getString('Filter'),
            cancelLabel: this.gettextCatalog.getString('Clear')
        };

        if (angular.isObject($stateParams.filters)) {
            _.extend(this.tasksFilter.params, $stateParams.filters);
        }
    }
    resetFiltersAndTags() {
        if (this.tasksTags.isResettable()) {
            this.tasksTags.reset();
        }
        if (this.tasksFilter.resettable) {
            this.tasksFilter.reset();
        }
    }
    showReset() {
        return this.tasksTags.isResettable() || this.tasksFilter.resettable;
    }

    // Invert the selected options of a multiselect filter
    invertMultiselect(filter) {
        var allOptions = _.map(filter.options, option => option.id);
        var selectedOptions = this.tasksFilter.params[filter.name];

        var allOption = '';
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
    }
}

const Filter = {
    controller: FilterController,
    template: require('./filter.html')
};

export default angular.module('mpdx.tasks.filter.component', [])
    .component('tasksFilter', Filter).name;
