import map from 'lodash/fp/map';
import reject from 'lodash/fp/reject';

class FieldController {
    constructor(
        contacts
    ) {
        this.contacts = contacts;
    }
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

import contacts from 'contacts/contacts.service';
import locale from 'common/locale/locale.service';

export default angular.module('mpdx.tools.fix.addresses.item.field.component', [
    locale, contacts
]).component('fixAddressesItemField', Field).name;
