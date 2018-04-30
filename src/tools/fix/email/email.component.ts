class EmailAddressesController {
    blockUI: IBlockUIService;
    source: string;
    constructor(
        $rootScope: ng.IRootScopeService,
        private gettextCatalog: ng.gettext.gettextCatalog,
        blockUI: IBlockUIService,
        private modal: ModalService,
        private fixEmailAddresses: FixEmailAddressesService
    ) {
        this.blockUI = blockUI.instances.get('fix-email-addresses');
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
    template: require('./email.html')
};

import 'angular-gettext';
import 'angular-block-ui';
import modal, { ModalService } from '../../../common/modal/modal.service';
import fixEmailAddresses, { FixEmailAddressesService } from './email.service';

export default angular.module('mpdx.tools.fix.emailAddresses.component', [
    'gettext', 'blockUI',
    modal, fixEmailAddresses
]).component('fixEmailAddresses', EmailAddresses).name;
