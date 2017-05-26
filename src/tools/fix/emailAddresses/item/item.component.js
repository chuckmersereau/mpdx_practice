class ItemController {
    fixEmailAddresses;

    constructor(
        blockUI,
        fixEmailAddresses
    ) {
        this.blockUI = blockUI;
        this.fixEmailAddresses = fixEmailAddresses;
    }

    $onInit() {
        this.blockUI = this.blockUI.instances.get(`fix-email-addresses-item-${this.person.id}`);
    }

    save() {
        this.blockUI.start();
        return this.fixEmailAddresses.save(this.person).then(() => {
            this.blockUI.reset();
        });
    }

    hasPrimary() {
        return this.fixEmailAddresses.hasPrimary(this.person);
    }
}

const Item = {
    controller: ItemController,
    template: require('./item.html'),
    bindings: {
        person: '<'
    }
};

import blockUI from 'angular-block-ui';
import fixEmailAddresses from '../emailAddresses.service';

export default angular.module('mpdx.tools.fix.emailAddresses.item.component', [
    blockUI,
    fixEmailAddresses
]).component('fixEmailAddressesItem', Item).name;
