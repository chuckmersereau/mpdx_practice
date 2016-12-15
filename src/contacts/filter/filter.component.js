class FilterController {
    contacts;
    contactFilter;
    contactsTags;
    modal;

    constructor(
        $stateParams, gettextCatalog,
        contactFilter, contactsTags, contacts, modal
    ) {
        this.modal = modal;
        this.contacts = contacts;
        this.contactFilter = contactFilter;
        this.contactsTags = contactsTags;
        this.gettextCatalog = gettextCatalog;

        this.dateRangeLocale = {
            applyLabel: this.gettextCatalog.getString('Filter'),
            cancelLabel: this.gettextCatalog.getString('Clear')
        };

        if (angular.isObject($stateParams.filters)) {
            _.extend(this.contactFilter.params, $stateParams.filters);
        }
    }
    resetFiltersAndTags() {
        if (this.contactsTags.isResettable()) {
            this.contactsTags.reset();
        }
        if (this.contactFilter.resettable) {
            this.contactFilter.reset();
        }
    }
    showReset() {
        return this.contactsTags.isResettable() || this.contactFilter.resettable;
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
        var allOptions = _.map(filter.options, option => option.id);
        var selectedOptions = this.contactFilter.params[filter.name];

        var allOption = '';
        if (filter.name === 'status') {
            allOption = 'active';
        }

        // If all options are selected other than 'All', then the inverse is 'All'
        if (_.isEqual(_.difference(allOptions, selectedOptions), [allOption])) {
            this.contactFilter.params[filter.name] = [''];
            return;
        }

        selectedOptions.push(allOption); // Exclude the 'All' option when inverting
        this.contactFilter.params[filter.name] = _.difference(allOptions, selectedOptions);
    }
}

const Filter = {
    controller: FilterController,
    template: require('./filter.html')
};

export default angular.module('mpdx.contacts.filter.component', [])
    .component('contactsFilter', Filter).name;
