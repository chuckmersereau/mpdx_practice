class AddressesController {
    constructor(
        $rootScope, gettextCatalog, blockUI,
        modal, fixAddresses
    ) {
        this.gettextCatalog = gettextCatalog;
        this.blockUI = blockUI.instances.get('fix-addresses');

        this.modal = modal;
        this.fixAddresses = fixAddresses;
        this.source = 'MPDX';

        $rootScope.$on('accountListUpdated', () => {
            this.load();
        });
    }

    save() {
        const message = this.gettextCatalog.getString(
            `You are updating all contacts visible on this page, setting the first {{source}} address as the primary address.
            If no such address exists the contact will not be updated. Are you sure you want to do this?`,
            { source: this.source }
        );
        return this.modal.confirm(message).then(() => {
            this.blockUI.start();
            return this.fixAddresses.bulkSave(this.source).then(() => {
                this.blockUI.reset();
            });
        });
    }

    load(page = null) {
        return this.fixAddresses.load(true, page);
    }
}

const Addresses = {
    controller: AddressesController,
    template: require('./addresses.html')
};

import gettextCatalog from 'angular-gettext';
import blockUI from 'angular-block-ui';
import modal from 'common/modal/modal.service';
import fixAddresses from './addresses.service';

export default angular.module('mpdx.tools.fix.addresses.component', [
    gettextCatalog, blockUI,
    modal, fixAddresses
]).component('fixAddresses', Addresses).name;
