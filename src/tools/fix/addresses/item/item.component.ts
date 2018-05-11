import 'angular-block-ui';
import { assign, filter, map } from 'lodash/fp';
import contacts, { ContactsService } from '../../../../contacts/contacts.service';

class ItemController {
    contact: any;
    onSave: any;
    constructor(
        private blockUI: IBlockUIService,
        private contacts: ContactsService
    ) {}
    $onInit() {
        this.blockUI = this.blockUI.instances.get(`fix-addresses-item-${this.contact.id}`);
    }
    save() {
        this.blockUI.start();
        this.contact.addresses = map((address) => {
            return assign(address, {
                valid_values: true
            });
        }, this.contact.addresses);

        return this.contacts.save(this.contact).then(() => {
            this.blockUI.reset();
            this.onSave({ contact: this.contact });
        });
    }
    hasPrimary() {
        return filter((address) => address.primary_mailing_address, this.contact.addresses).length === 1;
    }
}

const Item = {
    controller: ItemController,
    template: require('./item.html'),
    bindings: {
        contact: '<',
        onSave: '&'
    }
};

export default angular.module('mpdx.tools.fix.addresses.item.component', [
    'blockUI',
    contacts
]).component('fixAddressesItem', Item).name;
