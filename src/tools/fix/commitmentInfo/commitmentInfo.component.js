import reject from 'lodash/fp/reject';

class CommitmentInfoController {
    constructor(
        $rootScope, gettextCatalog, blockUI,
        contacts, modal, fixCommitmentInfo
    ) {
        this.$rootScope = $rootScope;
        this.contacts = contacts;
        this.gettextCatalog = gettextCatalog;
        this.modal = modal;
        this.fixCommitmentInfo = fixCommitmentInfo;

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
    template: require('./commitmentInfo.html')
};

import gettextCatalog from 'angular-gettext';
import blockUI from 'angular-block-ui';
import modal from 'common/modal/modal.service';
import fixCommitmentInfo from './commitmentInfo.service';

export default angular.module('mpdx.tools.fixCommitmentInfo.component', [
    gettextCatalog, blockUI,
    modal, fixCommitmentInfo
]).component('fixCommitmentInfo', FixCommitmentInfo).name;
