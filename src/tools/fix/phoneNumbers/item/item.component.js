class ItemController {
    fixPhoneNumbers;

    constructor(
        blockUI,
        fixPhoneNumbers
    ) {
        this.blockUI = blockUI;
        this.fixPhoneNumbers = fixPhoneNumbers;
    }

    $onInit() {
        this.blockUI = this.blockUI.instances.get(`fix-phone-numbers-item-${this.person.id}`);
    }

    save() {
        this.blockUI.start();
        return this.fixPhoneNumbers.save(this.person).then(() => {
            this.blockUI.reset();
        });
    }

    hasPrimary() {
        return this.fixPhoneNumbers.hasPrimary(this.person);
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
import fixPhoneNumbers from '../phoneNumbers.service';

export default angular.module('mpdx.tools.fix.phoneNumbers.item.component', [
    blockUI, fixPhoneNumbers
]).component('fixPhoneNumbersItem', Item).name;
