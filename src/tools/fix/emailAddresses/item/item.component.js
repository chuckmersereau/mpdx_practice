class ItemController {
    fixEmailAddresses;

    constructor(
        $log, $q, blockUI,
        fixEmailAddresses
    ) {
        this.$log = $log;
        this.$q = $q;
        this.blockUI = blockUI;

        this.fixEmailAddresses = fixEmailAddresses;
    }

    $onInit() {
        this.blockUI = this.blockUI.instances.get(`fix-phone-numbers-item-${this.person.id}`);
    }

    save() {
        this.blockUI.start();
        return this.fixEmailAddresses.save(this.person).finally(() => {
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

export default angular.module('mpdx.tools.fix.emailAddresses.item.component', [])
    .component('fixEmailAddressesItem', Item).name;
