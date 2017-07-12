import find from 'lodash/fp/find';
import findIndex from 'lodash/fp/findIndex';

class ContactsSearchController {
    contacts;
    contactFilter;

    constructor(
        $state, $timeout,
        contacts, contactFilter
    ) {
        this.$state = $state;
        this.$timeout = $timeout;
        this.contacts = contacts;
        this.contactFilter = contactFilter;

        this.searchParams = '';
        this.contactList = [];
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
            this.contactFilter.wildcard_search = angular.copy(this.searchParams);
            this.$state.go('contacts', {}, {reload: true});
            this.reset();
        }
    }

    search() {
        return this.contacts.search(this.searchParams).then((data) => {
            this.contactList = data;
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

import contacts from '../../contacts/contacts.service';
import contactFilter from '../../contacts/sidebar/filter/filter.service';
import uiRouter from 'angular-ui-router';

export default angular.module('mpdx.menu.search.component', [
    uiRouter,
    contacts, contactFilter
]).component('menuSearch', Search).name;
