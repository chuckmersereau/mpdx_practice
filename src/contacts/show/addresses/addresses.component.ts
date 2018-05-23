import { eq, map } from 'lodash/fp';
import contacts, { ContactsService } from '../../contacts.service';
import modal, { ModalService } from '../../../common/modal/modal.service';

class AddressesController {
    constructor(
        private $log: ng.ILogService,
        private gettextCatalog: ng.gettext.gettextCatalog,
        private contacts: ContactsService,
        private modal: ModalService
    ) {}
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

export default angular.module('mpdx.contacts.details.addresses.component', [
    contacts, modal
]).component('contactAddresses', Addresses).name;