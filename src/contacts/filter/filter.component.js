import assign from 'lodash/fp/assign';
import concat from 'lodash/fp/concat';
import difference from 'lodash/fp/difference';
import isEqual from 'lodash/fp/isEqual';
import map from 'lodash/fp/map';

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
    showReset() {
        return this.contactsTags.isResettable() || this.contactFilter.isResettable();
    }
    // Invert the selected options of a multiselect filter
    invertMultiselect(filter) {
        const allOptions = map('id', filter.options);
        let selectedOptions = this.contactFilter.params[filter.name];

        let allOption = '';
        if (filter.name === 'status') {
            allOption = 'active';
        }

        // If all options are selected other than 'All', then the inverse is 'All'
        if (isEqual(difference(allOptions, selectedOptions), [allOption])) {
            this.contactFilter.params[filter.name] = [''];
            return;
        }

        selectedOptions = concat(selectedOptions, allOption); // Exclude the 'All' option when inverting
        this.contactFilter.params[filter.name] = difference(allOptions, selectedOptions);
        this.contactFilter.change();
    }
}

const Filter = {
    controller: FilterController,
    template: require('./filter.html')
};

export default angular.module('mpdx.contacts.filter.component', [])
    .component('contactsFilter', Filter).name;
