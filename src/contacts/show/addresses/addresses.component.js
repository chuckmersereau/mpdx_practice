import { eq, map } from 'lodash/fp';

class AddressesController {
    constructor(
        $log, gettextCatalog,
        contacts, modal
    ) {
        this.$log = $log;
        this.gettextCatalog = gettextCatalog;
        this.contacts = contacts;
        this.modal = modal;
    }
    onAddressPrimary(addressId) {
        /* istanbul ignore next */
        this.$log.debug('change primary: ', addressId);
        const msg = this.gettextCatalog.getString(
            'This address will be used for your newsletters. Would you like to change to have this address as primary?'
        );
        return this.modal.confirm(msg).then(() => {
            const addressPatch = map((address) => ({
                id: address.id,
                primary_mailing_address: eq(address.id, addressId)
            }), this.contacts.current.addresses);
            const successMessage = this.gettextCatalog.getString('Changes saved successfully.');
            const errorMessage = this.gettextCatalog.getString('Unable to save changes.');

            return this.contacts.save(
                { id: this.contacts.current.id, addresses: addressPatch },
                successMessage,
                errorMessage
            );
        });
    }
}

const Addresses = {
    template: require('./addresses.html'),
    controller: AddressesController
};

import address from './address/index.module';

export default angular.module('mpdx.contacts.details.addresses.component', [
    address
]).component('contactAddresses', Addresses).name;