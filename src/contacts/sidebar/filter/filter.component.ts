import { assign } from 'lodash/fp';
import { stringToNameObjectArray } from '../../../common/fp/tags';

class FilterController {
    activeFilters: any[];
    dateRangeLocale: any;
    constructor(
        private $stateParams: StateParams,
        private gettextCatalog: ng.gettext.gettextCatalog,
        private contactFilter: ContactFilterService,
        private contactsTags: ContactsTagsService,
        private contacts: ContactsService,
        private filters: FiltersService,
        private modal: ModalService,
        private users: UsersService
    ) {
        this.dateRangeLocale = {
            applyLabel: this.gettextCatalog.getString('Filter'),
            cancelLabel: this.gettextCatalog.getString('Clear')
        };

        if (angular.isObject($stateParams.filters)) {
            this.contactFilter.params = (assign as any)({}, this.contactFilter.params, $stateParams.filters);
        }

        this.activeFilters = [];
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
        const params = this.filters.fromStrings(value.params, this.contactFilter.data);
        this.contactFilter.params = assign(this.contactFilter.default_params, params);
        this.contactFilter.wildcardSearch = value.wildcard_search;
        this.contactsTags.anyTags = value.any_tags;
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
                anyTags: this.contactsTags.anyTags,
                filterType: 'contacts',
                params: this.contactFilter.params,
                rejectedTags: this.contactsTags.rejectedTags,
                selectedTags: this.contactsTags.selectedTags,
                wildcardSearch: this.contactFilter.wildcardSearch
            }
        });
    }
}

const Filter = {
    controller: FilterController,
    template: require('./filter.html')
};

import contacts, { ContactsService } from '../../contacts.service';
import contactFilter, { ContactFilterService } from './filter.service';
import contactsTags, { ContactsTagsService } from './tags/tags.service';
import modal, { ModalService } from '../../../common/modal/modal.service';
import users, { UsersService } from '../../../common/users/users.service';
import { StateParams } from '@uirouter/core';
import { FiltersService } from '../../../common/filters/filters.service';

export default angular.module('mpdx.contacts.filter.component', [
    contactFilter, contactsTags, contacts, modal, users
]).component('contactsFilter', Filter).name;