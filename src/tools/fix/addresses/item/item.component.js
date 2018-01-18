import assign from 'lodash/fp/assign';
import map from 'lodash/fp/map';
import filter from 'lodash/fp/filter';


class ItemController {
    constructor(
        blockUI, contacts
    ) {
        this.blockUI = blockUI;
        this.contacts = contacts;
    }
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

import blockUI from 'angular-block-ui';
import contacts from 'contacts/contacts.service';

export default angular.module('mpdx.tools.fix.addresses.item.component', [
    blockUI,
    contacts
]).component('fixAddressesItem', Item).name;
