class FieldController {
    constructor(
        fixAddresses, locale, contacts
    ) {
        this.fixAddresses = fixAddresses;
        this.contacts = contacts;
        this.locale = locale;
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
        this.fixAddresses.removeAddress(this.contact, this.address);
    }

    setPrimary() {
        this.fixAddresses.setPrimary(this.contact, this.address);
    }
}

const Field = {
    controller: FieldController,
    template: require('./field.html'),
    bindings: {
        contact: '<',
        address: '<'
    }
};

import fixAddresses from '../../addresses.service';
import contacts from 'contacts/contacts.service';
import locale from 'common/locale/locale.service';

export default angular.module('mpdx.tools.fix.addresses.item.field.component', [
    fixAddresses, locale, contacts
]).component('fixAddressesItemField', Field).name;
