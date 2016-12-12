class FilterController {
    contacts;
    filterService;
    modal;
    tags;

    constructor($stateParams, filterService, tags, contacts, modal, gettextCatalog) {
        this.modal = modal;
        this.contacts = contacts;
        this.filterService = filterService;
        this.gettextCatalog = gettextCatalog;
        this.tags = tags;

        this.dateRangeLocale = {
            applyLabel: this.gettextCatalog.getString('Filter'),
            cancelLabel: this.gettextCatalog.getString('Clear')
        };

        if (angular.isObject($stateParams.filters)) {
            _.extend(this.filterService.params, $stateParams.filters);
        }
    }
    resetFiltersAndTags() {
        if (this.tags.isResettable()) {
            this.tags.reset();
        }
        if (this.filterService.resettable) {
            this.filterService.reset();
        }
    }
    showReset() {
        return this.tags.isResettable() || this.filterService.resettable;
    }

    openMapContactsModal() {
        this.modal.open({
            template: require('./mapContacts/mapContacts.html'),
            controller: 'mapContactsController',
            locals: {
                selectedContacts: this.contacts.getSelectedContacts()
            }
        });
    }
    // Invert the selected options of a multiselect filter
    invertMultiselect(filter) {
        const allOptions = _.map(filter.options, option => option.id);
        const selectedOptions = this.filterService.params[filter.name];

        let allOption = '';
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

export default angular.module('mpdx.contacts.filter.component', [])
    .component('contactsFilter', Filter).name;
