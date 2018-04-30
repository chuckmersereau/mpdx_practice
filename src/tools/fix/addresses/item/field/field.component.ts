import { map, reject } from 'lodash/fp';

class FieldController {
    address: any;
    contact: any;
    constructor(
        private contacts: ContactsService
    ) {}
    addressSummary() {
        if (!this.address || !this.address.street) {
            return '';
        }

        let summary = this.address.street;

        if (this.address.city) {
            summary += `, ${this.address.city}`;
        }
        if (this.address.state) {
            summary += ` ${this.address.state}`;
        }
        if (this.address.postal_code) {
            summary += `. ${this.address.postal_code}`;
        }
        return summary;
    }
    remove() {
        return this.contacts.deleteAddress(this.contact.id, this.address.id).then(() => {
            this.contact.addresses = reject({ id: this.address.id }, this.contact.addresses);
        });
    }
    setPrimary() {
        this.contact.addresses = map((address) => {
            address.primary_mailing_address = address.id === this.address.id;
            return address;
        }, this.contact.addresses);
    }
}

const Field = {
    controller: FieldController,
    template: require('./field.html'),
    bindings: {
        contact: '=',
        address: '<'
    }
};

import contacts, { ContactsService } from '../../../../../contacts/contacts.service';

export default angular.module('mpdx.tools.fix.addresses.item.field.component', [
    contacts
]).component('fixAddressesItemField', Field).name;
