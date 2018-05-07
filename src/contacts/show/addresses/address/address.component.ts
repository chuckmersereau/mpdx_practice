class AddressController {
    address: any;
    isEditable: boolean;
    mapLink: string;
    constructor(
        private contacts: ContactsService
    ) {}
    $onChanges() {
        if (this.address) {
            let address = `${this.address.street}`;
            if (this.address.city) {
                address += `, ${this.address.city}`;
            }
            if (this.address.state) {
                address += `, ${this.address.state}`;
            }
            if (this.address.postal_code) {
                address += `, ${this.address.postal_code}`;
            }
            this.mapLink = `https://www.google.com/maps/search/?api=1&query=${address}`;
            this.isEditable = !this.address.remote_id
                && (this.address.source === 'MPDX'
                    || this.address.source === 'manual'
                    || this.address.source === 'TntImport');
        }
    }
}

const Address = {
    controller: AddressController,
    template: require('./address.html'),
    bindings: {
        address: '<',
        contact: '<',
        onPrimary: '&'
    }
};

import contacts, { ContactsService } from '../../../contacts.service';

export default angular.module('mpdx.contacts.show.addresses.address.component', [
    contacts
]).component('contactAddress', Address).name;
