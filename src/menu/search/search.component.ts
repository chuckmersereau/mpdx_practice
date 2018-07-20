import { find, findIndex } from 'lodash/fp';
import { StateService } from '@uirouter/core';
import api, { ApiService } from '../../common/api/api.service';
import contactFilter, { ContactFilterService } from '../../contacts/sidebar/filter/filter.service';
import uiRouter from '@uirouter/angularjs';

class ContactsSearchController {
    contactList: any;
    moreActive: boolean;
    searchParams: string;
    loading: boolean;
    constructor(
        private $state: StateService,
        private $timeout: ng.ITimeoutService,
        private api: ApiService,
        private contactFilter: ContactFilterService
    ) {
        this.searchParams = '';
        this.contactList = [];
        this.loading = false;
        this.moreActive = false;
    }
    reset() {
        this.$timeout(() => {
            this.searchParams = '';
            this.contactList = [];
        }, 500);
    }
    go(contactId) {
        this.reset();
        this.$state.go('contacts.show', { contactId: contactId });
    }
    gotoList() {
        const activeContact = find('active', this.contactList);
        if (activeContact) {
            this.go(activeContact.id);
        } else {
            this.contactFilter.wildcardSearch = angular.copy(this.searchParams);
            this.$state.go('contacts', {}, { reload: true });
            this.reset();
        }
    }
    search() {
        this.loading = true;
        return this.api.get({
            url: 'contacts',
            data: {
                filter: {
                    account_list_id: this.api.account_list_id,
                    status: 'active,hidden,null',
                    wildcard_search: this.searchParams
                },
                fields: {
                    contacts: 'name'
                },
                per_page: 6,
                sort: 'name'
            }
        }).then((data) => {
            this.contactList = data;
            this.loading = false;
        }).catch(() => {
            this.loading = false;
        });
    }
    keyup(event) {
        if ((event.keyCode === 38 || event.keyCode === 40) && this.contactList.length !== 0) {
            let activeIndex;
            activeIndex = findIndex({ active: true }, this.contactList);
            this.moreActive = false;
            if (activeIndex >= 0) {
                this.contactList[activeIndex].active = false;
            }
            switch (event.keyCode) {
                case 38:
                    if (activeIndex >= 0) {
                        if (this.contactList[activeIndex - 1]) {
                            this.contactList[activeIndex - 1].active = true;
                        } else {
                            this.moreActive = true;
                        }
                    } else if (this.contactList.length > 0) {
                        this.contactList[this.contactList.length - 1].active = true;
                    }
                    break;
                case 40:
                    if (activeIndex >= 0) {
                        if (this.contactList[activeIndex + 1]) {
                            this.contactList[activeIndex + 1].active = true;
                        } else {
                            this.moreActive = true;
                        }
                    } else if (this.contactList.length > 0) {
                        this.contactList[0].active = true;
                    }
                    break;
            }
        }
    }
}
const Search = {
    controller: ContactsSearchController,
    template: require('./search.html')
};

export default angular.module('mpdx.menu.search.component', [
    uiRouter,
    api, contactFilter
]).component('menuSearch', Search).name;
