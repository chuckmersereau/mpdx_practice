class EmailAddressesController {
    constructor(
        $rootScope, gettextCatalog, blockUI,
        modal, fixEmailAddresses
    ) {
        this.gettextCatalog = gettextCatalog;
        this.blockUI = blockUI.instances.get('fix-email-addresses');

        this.modal = modal;
        this.fixEmailAddresses = fixEmailAddresses;
        this.source = 'MPDX';

        $rootScope.$on('accountListUpdated', () => {
            this.load(true);
        });
    }

    save() {
        const message = this.gettextCatalog.getString(
            `You are updating all contacts visible on this page, setting the first {{source}} email address as the
            primary email address. If no such email address exists the contact will not be updated.
            Are you sure you want to do this?`,
            { source: this.source }
        );
        return this.modal.confirm(message).then(() => {
            this.blockUI.start();
            return this.fixEmailAddresses.bulkSave(this.source).then(() => {
                this.blockUI.reset();
            });
        });
    }

    load(page = null) {
        return this.fixEmailAddresses.load(true, page);
    }
}

const EmailAddresses = {
    controller: EmailAddressesController,
    template: require('./emailAddresses.html')
};

import gettextCatalog from 'angular-gettext';
import blockUI from 'angular-block-ui';
import modal from 'common/modal/modal.service';
import fixEmailAddresses from './emailAddresses.service';

export default angular.module('mpdx.tools.fix.emailAddresses.component', [
    gettextCatalog, blockUI,
    modal, fixEmailAddresses
]).component('fixEmailAddresses', EmailAddresses).name;
