class CommitmentInfoController {
    fixCommitmentInfo;

    constructor(
        gettextCatalog, blockUI,
        modal, fixCommitmentInfo
    ) {
        this.gettextCatalog = gettextCatalog;
        this.blockUI = blockUI.instances.get('fix-commitment-info');

        this.modal = modal;
        this.fixCommitmentInfo = fixCommitmentInfo;
    }

    save() {
        const message = this.gettextCatalog.getString("Are you sure?");
        return this.modal.confirm(message).then(() => {
            this.blockUI.start();
            return this.fixCommitmentInfo.bulkSave().finally(() => {
                this.blockUI.reset();
            });
        });
    }

    load(page) {
        this.fixCommitmentInfo.load(true, page);
    }
}

const FixCommitmentInfo = {
    controller: CommitmentInfoController,
    template: require('./commitmentInfo.html')
};

export default angular.module('mpdx.tools.fixCommitmentInfo.component', [])
    .component('fixCommitmentInfo', FixCommitmentInfo).name;