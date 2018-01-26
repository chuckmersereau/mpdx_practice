import { assign } from 'lodash/fp';

class FilterController {
    constructor(
        $stateParams, gettextCatalog,
        contactFilter, contactsTags, contacts, filters, modal
    ) {
        this.contacts = contacts;
        this.contactFilter = contactFilter;
        this.contactsTags = contactsTags;
        this.filters = filters;
        this.modal = modal;
        this.gettextCatalog = gettextCatalog;

        this.dateRangeLocale = {
            applyLabel: this.gettextCatalog.getString('Filter'),
            cancelLabel: this.gettextCatalog.getString('Clear')
        };

        if (angular.isObject($stateParams.filters)) {
            this.contactFilter.params = assign({}, this.contactFilter.params, $stateParams.filters);
        }
    }
    resetFiltersAndTags() {
        if (this.contactsTags.isResettable()) {
            this.contactsTags.reset();
        }
        if (this.contactFilter.isResettable()) {
            this.contactFilter.reset();
        }
    }
}

const Filter = {
    controller: FilterController,
    template: require('./filter.html')
};

export default angular.module('mpdx.contacts.filter.component', [])
    .component('contactsFilter', Filter).name;
