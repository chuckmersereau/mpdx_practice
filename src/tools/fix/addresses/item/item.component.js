class ItemController {
    fixAddresses;

    constructor(
        $log, $q, blockUI,
        fixAddresses
    ) {
        this.$log = $log;
        this.$q = $q;
        this.blockUI = blockUI;

        this.fixAddresses = fixAddresses;
    }

    $onInit() {
        this.blockUI = this.blockUI.instances.get(`fix-addresses-item-${this.contact.id}`);
    }

    save() {
        this.blockUI.start();
        return this.fixAddresses.save(this.contact).finally(() => {
            this.blockUI.reset();
        });
    }
}

const Item = {
    controller: ItemController,
    template: require('./item.html'),
    bindings: {
        contact: '<'
    }
};

export default angular.module('mpdx.tools.fix.addresses.item.component', [])
    .component('fixAddressesItem', Item).name;
