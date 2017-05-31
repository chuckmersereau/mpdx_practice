class PhoneNumbersController {
    fixPhoneNumbers;

    constructor(
        $rootScope, gettextCatalog, blockUI,
        modal, fixPhoneNumbers
    ) {
        this.gettextCatalog = gettextCatalog;
        this.blockUI = blockUI.instances.get('fix-phone-numbers');

        this.modal = modal;
        this.fixPhoneNumbers = fixPhoneNumbers;
        this.source = 'MPDX';

        $rootScope.$on('accountListUpdated', () => {
            this.load(true);
        });
    }

    save() {
        const message = this.gettextCatalog.getString(
            `You are updating all visible contacts to set the first {{source}} phone number as the
            primary phone number. If no such phone number exists the contact will not be updated.
            Are you sure you want to do this?`,
            { source: this.source }
        );
        return this.modal.confirm(message).then(() => {
            this.blockUI.start();
            return this.fixPhoneNumbers.bulkSave(this.source).then(() => {
                this.blockUI.reset();
            });
        });
    }

    load(page = null) {
        return this.fixPhoneNumbers.load(true, page);
    }
}

const PhoneNumbers = {
    controller: PhoneNumbersController,
    template: require('./phoneNumbers.html')
};

import gettextCatalog from 'angular-gettext';
import blockUI from 'angular-block-ui';
import modal from 'common/modal/modal.service';
import fixPhoneNumbers from './phoneNumbers.service';

export default angular.module('mpdx.tools.fix.phoneNumbers.component', [
    gettextCatalog, blockUI,
    modal, fixPhoneNumbers
]).component('fixPhoneNumbers', PhoneNumbers).name;
