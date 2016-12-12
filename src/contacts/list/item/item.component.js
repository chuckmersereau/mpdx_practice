class ContactListItemController {
    constructor($state, state) {
        this.$state = $state;

        this.current_currency_symbol = state.current_currency_symbol;
    }
    switchContact() {
        this.selected = this.contact.id;
        this.$state.transitionTo('contact', { contactId: this.contact.id }, { notify: false });
    }
    hasSendNewsletterError() {
        if (!angular.isDefined(this.contact.addresses) || angular.isDefined(this.contact.email_addresses)) {
            return false;
        }
        const missingAddress = this.contact.addresses.length === 0;
        const missingEmailAddress = this.contact.email_addresses.length === 0;
        switch (this.contact.attributes.send_newsletter) {
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
    stopPropagation(e) {
        e.stopPropagation();
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

export default angular.module('mpdx.contacts.list.item', [])
    .component('contactsListItem', Item).name;
