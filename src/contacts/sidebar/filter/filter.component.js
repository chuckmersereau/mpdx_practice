import { assign, find, get } from 'lodash/fp';
import { split } from 'common/fp/strings';
import reduceObject from 'common/fp/reduceObject';
import { stringToNameObjectArray } from 'common/fp/tags';

class FilterController {
    constructor(
        $stateParams, gettextCatalog,
        contactFilter, contactsTags, contacts, filters, modal, users
    ) {
        this.contacts = contacts;
        this.contactFilter = contactFilter;
        this.contactsTags = contactsTags;
        this.filters = filters;
        this.modal = modal;
        this.gettextCatalog = gettextCatalog;
        this.users = users;

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
    useSavedFilter(name) {
        const option = this.users.getCurrentOptionValue(`saved_contacts_filter_${name}`);
        const value = JSON.parse(option);
        const params = reduceObject((result, value, key) => {
            const filter = find({ name: key }, this.contactFilter.data);
            const isMultiselect = get('type', filter) === 'multiselect';
            result[key] = isMultiselect ? split(',', value) : value;
            return result;
        }, {}, value.params);
        this.contactFilter.params = assign(this.contactFilter.default_params, params);
        this.contactFilter.wildcard_search = value.wildcard_search;
        this.contactsTags.any_tags = value.any_tags;
        this.contactsTags.rejectedTags = stringToNameObjectArray(value.exclude_tags);
        this.contactsTags.selectedTags = stringToNameObjectArray(value.tags);
        this.contactFilter.change();
        this.contactFilter.selectedSave = name;
    }
    openSaveModal() {
        this.modal.open({
            controller: 'saveFilterModal',
            template: require('../../../common/filters/save/save.html'),
            locals: {
                anyTags: this.contactsTags.any_tags,
                filterType: 'contacts',
                params: this.contactFilter.params,
                rejectedTags: this.contactsTags.rejectedTags,
                selectedTags: this.contactsTags.selectedTags,
                wildcardSearch: this.contactFilter.wildcard_search
            }
        });
    }
}

const Filter = {
    controller: FilterController,
    template: require('./filter.html')
};

import contacts from 'contacts/contacts.service';
import contactFilter from './filter.service';
import modal from 'common/modal/modal.service';
import users from 'common/users/users.service';

export default angular.module('mpdx.contacts.filter.component', [
    contactFilter, contacts, modal, users
]).component('contactsFilter', Filter).name;
