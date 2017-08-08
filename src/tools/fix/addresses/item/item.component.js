class ItemController {
    constructor(
        blockUI,
        fixAddresses
    ) {
        this.blockUI = blockUI;
        this.fixAddresses = fixAddresses;
    }

    $onInit() {
        this.blockUI = this.blockUI.instances.get(`fix-addresses-item-${this.contact.id}`);
    }

    save() {
        this.blockUI.start();
        return this.fixAddresses.save(this.contact).then(() => {
            this.blockUI.reset();
        });
    }

    hasPrimary() {
        return this.fixAddresses.hasPrimary(this.contact);
    }
}

const Item = {
    controller: ItemController,
    template: require('./item.html'),
    bindings: {
        contact: '<'
    }
};

import blockUI from 'angular-block-ui';
import fixAddresses from '../addresses.service';

export default angular.module('mpdx.tools.fix.addresses.item.component', [
    blockUI,
    fixAddresses
]).component('fixAddressesItem', Item).name;
