import flatten from 'lodash/fp/flatten';
import includes from 'lodash/fp/includes';
import map from 'lodash/fp/map';
import pull from 'lodash/fp/pull';
import union from 'lodash/fp/union';

class ItemController {
    contact;
    contacts;
    people;
    constructor(
        $rootScope, $state,
        contacts, people, users
    ) {
        this.$state = $state;
        this.contacts = contacts;
        this.people = people;

        this.current_currency_symbol = users.current.currency_symbol;

        $rootScope.$on('contactTagDeleted', (e, val) => {
            if (!val.contactIds || includes(this.contact.id, val.contactIds)) {
                this.contact.tag_list = pull(val.tag, this.contact.tag_list);
            }
        });
        $rootScope.$on('contactTagsAdded', (e, val) => {
            if (!val.contactIds || includes(this.contact.id, val.contactIds)) {
                this.contact.tag_list = union(this.contact.tag_list, val.tags);
            }
        });
    }
    hasSendNewsletterError() {
        if (!this.contact.addresses || !this.contact.people) {
            return false;
        }
        const missingAddress = this.contact.addresses.length === 0;
        const missingEmailAddress = flatten(map('email_addresses', this.contact.people)).length === 0;
        switch (this.contact.send_newsletter) {
            case 'Both':
                return missingAddress || missingEmailAddress;
            case 'Physical':
                return missingAddress;
            case 'Email':
                return missingEmailAddress;
        }
        return false;
    }
    toggleCheckbox() {
        if (this.contacts.isSelected(this.contact.id)) {
            this.contacts.selectContact(this.contact.id);
        } else {
            this.contacts.deSelectContact(this.contact.id);
        }
    }
}

const Item = {
    controller: ItemController,
    template: require('./item.html'),
    bindings: {
        contact: '=',
        hide: '&',
        view: '@',
        selected: '='
    }
};

export default angular.module('mpdx.contacts.list.item.component', [])
    .component('contactsListItem', Item).name;
