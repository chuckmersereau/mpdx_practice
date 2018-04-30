import { reject } from 'lodash/fp';

class CommitmentInfoController {
    blockUI: IBlockUIService;
    data: any;
    watcher: any;
    watcher2: any;
    constructor(
        private $rootScope: ng.IRootScopeService,
        private gettextCatalog: ng.gettext.gettextCatalog,
        blockUI: IBlockUIService,
        private contacts: ContactsService,
        private modal: ModalService,
        private fixCommitmentInfo: FixCommitmentInfoService
    ) {
        this.blockUI = blockUI.instances.get('fix-commitment-info');
    }
    $onInit() {
        this.watcher = this.$rootScope.$on('contactHidden', (e, id) => {
            this.fixCommitmentInfo.data = reject({ id: id }, this.data);
        });
        this.watcher2 = this.$rootScope.$on('accountListUpdated', () => {
            this.load();
        });
    }
    $onDestroy() {
        this.watcher();
        this.watcher2();
    }
    save() {
        const message = this.gettextCatalog.getString(
            `You are updating all visible contacts to the visible Commitment Info.
            Are you sure you want to do this?`
        );
        return this.modal.confirm(message).then(() => {
            this.blockUI.start();
            return this.fixCommitmentInfo.bulkSave().then(() => {
                this.blockUI.reset();
            });
        });
    }
    load(page = null) {
        return this.fixCommitmentInfo.load(true, page);
    }
}

const FixCommitmentInfo = {
    controller: CommitmentInfoController,
    template: require('./commitment.html')
};

import 'angular-gettext';
import 'angular-block-ui';
import fixCommitmentInfo, { FixCommitmentInfoService } from './commitment.service';
import contacts, { ContactsService } from '../../../contacts/contacts.service';
import modal, { ModalService } from '../../../common/modal/modal.service';

export default angular.module('mpdx.tools.fixCommitmentInfo.component', [
    'gettext', 'blockUI',
    contacts, modal, fixCommitmentInfo
]).component('fixCommitmentInfo', FixCommitmentInfo).name;
