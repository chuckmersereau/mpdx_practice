import 'angular-block-ui';
import 'angular-gettext';
import fixPhoneNumbers, { FixPhoneNumbersService } from './phone.service';
import modal, { ModalService } from '../../../common/modal/modal.service';

class PhoneNumbersController {
    blockUI: IBlockUIService;
    source: string;
    watcher: () => void;
    constructor(
        $rootScope: ng.IRootScopeService,
        private gettextCatalog: ng.gettext.gettextCatalog,
        blockUI: IBlockUIService,
        private modal: ModalService,
        private fixPhoneNumbers: FixPhoneNumbersService
    ) {
        this.blockUI = blockUI.instances.get('fix-phone-numbers');
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
            `You are updating all contacts visible on this page, setting the first {{source}} phone number as the
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

const PhoneNumbers: ng.IComponentOptions = {
    controller: PhoneNumbersController,
    template: require('./phone.html')
};

export default angular.module('mpdx.tools.fix.phoneNumbers.component', [
    'gettext', 'blockUI',
    modal, fixPhoneNumbers
]).component('fixPhoneNumbers', PhoneNumbers).name;
