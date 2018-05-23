import 'angular-block-ui';
import 'angular-gettext';
import fixEmailAddresses, { FixEmailAddressesService } from './email.service';
import modal, { ModalService } from '../../../common/modal/modal.service';

class EmailAddressesController {
    blockUI: IBlockUIService;
    source: string;
    watcher: () => void;
    constructor(
        $rootScope: ng.IRootScopeService,
        private gettextCatalog: ng.gettext.gettextCatalog,
        blockUI: IBlockUIService,
        private modal: ModalService,
        private fixEmailAddresses: FixEmailAddressesService
    ) {
        this.blockUI = blockUI.instances.get('fix-email-addresses');
        this.source = 'MPDX';

        this.watcher = $rootScope.$on('accountListUpdated', () => {
            this.load(true);
        });
    }
    $onDestroy() {
        this.watcher();
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

const EmailAddresses: ng.IComponentOptions = {
    controller: EmailAddressesController,
    template: require('./email.html')
};

export default angular.module('mpdx.tools.fix.emailAddresses.component', [
    'gettext', 'blockUI',
    modal, fixEmailAddresses
]).component('fixEmailAddresses', EmailAddresses).name;
