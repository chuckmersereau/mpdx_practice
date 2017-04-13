class ItemController {
    fixPhoneNumbers;

    constructor(
        $log, $q, blockUI,
        fixPhoneNumbers
    ) {
        this.$log = $log;
        this.$q = $q;
        this.blockUI = blockUI;

        this.fixPhoneNumbers = fixPhoneNumbers;
    }

    $onInit() {
        this.blockUI = this.blockUI.instances.get(`fix-phone-numbers-item-${this.person.id}`);
    }

    save() {
        this.blockUI.start();
        return this.fixPhoneNumbers.save(this.person).finally(() => {
            this.blockUI.reset();
        });
    }
}

const Item = {
    controller: ItemController,
    template: require('./item.html'),
    bindings: {
        person: '<'
    }
};

export default angular.module('mpdx.tools.fix.phoneNumbers.item.component', [])
    .component('fixPhoneNumbersItem', Item).name;
