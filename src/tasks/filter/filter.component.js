class FilterController {
    tasksService;
    filterService;
    tasksTagsService;
    modal;

    constructor($stateParams, tasksFilterService, tasksTagsService, tasksService, modal, gettextCatalog) {
        this.modal = modal;
        this.tasksService = tasksService;
        this.filterService = tasksFilterService;
        this.gettextCatalog = gettextCatalog;
        this.tasksTagsService = tasksTagsService;

        this.dateRangeLocale = {
            applyLabel: this.gettextCatalog.getString('Filter'),
            cancelLabel: this.gettextCatalog.getString('Clear')
        };

        if (angular.isObject($stateParams.filters)) {
            _.extend(this.filterService.params, $stateParams.filters);
        }
    }
    resetFiltersAndTags() {
        if (this.tasksTagsService.isResettable()) {
            this.tasksTagsService.reset();
        }
        if (this.filterService.resettable) {
            this.filterService.reset();
        }
    }
    showReset() {
        return this.tasksTagsService.isResettable() || this.filterService.resettable;
    }

    // Invert the selected options of a multiselect filter
    invertMultiselect(filter) {
        var allOptions = _.map(filter.options, option => option.id);
        var selectedOptions = this.filterService.params[filter.name];

        var allOption = '';
        if (filter.name === 'status') {
            allOption = 'active';
        }

        // If all options are selected other than 'All', then the inverse is 'All'
        if (_.isEqual(_.difference(allOptions, selectedOptions), [allOption])) {
            this.filterService.params[filter.name] = [''];
            return;
        }

        selectedOptions.push(allOption); // Exclude the 'All' option when inverting
        this.filterService.params[filter.name] = _.difference(allOptions, selectedOptions);
    }
}

const Filter = {
    controller: FilterController,
    template: require('./filter.html')
};

export default angular.module('mpdx.tasks.filter.component', [])
    .component('tasksFilter', Filter).name;
