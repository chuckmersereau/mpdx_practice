class AddressesController {
    fixAddresses;

    constructor(
        gettextCatalog, blockUI,
        modal, fixAddresses
    ) {
        this.gettextCatalog = gettextCatalog;
        this.blockUI = blockUI.instances.get('fix-addresses');

        this.modal = modal;
        this.fixAddresses = fixAddresses;
        this.source = 'MPDX';
    }

    save() {
        const message = this.gettextCatalog.getString("You are updating all visible contacts to set the first {{source}} address as the primary address. If no such address exists the contact will not be updated. Are you sure you want to do this?", { source: this.source });
        return this.modal.confirm(message).then(() => {
            this.blockUI.start();
            return this.fixAddresses.bulkSave(this.source).finally(() => {
                this.blockUI.reset();
            });
        });
    }

    load(page) {
        this.fixAddresses.load(true, page);
    }
}

const Addresses = {
    controller: AddressesController,
    template: require('./addresses.html')
};

export default angular.module('mpdx.tools.fix.addresses.component', [])
    .component('fixAddresses', Addresses).name;
