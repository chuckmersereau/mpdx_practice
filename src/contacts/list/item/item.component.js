import includes from 'lodash/fp/includes';
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
    switchContact() {
        this.selected = this.contact.id;
        this.$state.transitionTo('contacts.show', { contactId: this.contact.id }, { notify: false });
    }
    hasSendNewsletterError() {
        if (!angular.isDefined(this.contact.addresses) || !angular.isDefined(this.contact.email_addresses)) {
            return false;
        }
        const missingAddress = this.contact.addresses.length === 0;
        const missingEmailAddress = this.contact.email_addresses.length === 0;
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
