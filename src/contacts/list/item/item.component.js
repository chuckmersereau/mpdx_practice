class ContactListItemController {
    contact;
    people;
    constructor(
        $state,
        people, users
    ) {
        this.$state = $state;
        this.people = people;

        this.current_currency_symbol = users.current.currency_symbol;
    }
    switchContact() {
        this.selected = this.contact.id;
        this.$state.transitionTo('contact', { contactId: this.contact.id }, { notify: false });
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
        this.contact.selected = !this.contact.selected;
    }
}

const Item = {
    controller: ContactListItemController,
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
