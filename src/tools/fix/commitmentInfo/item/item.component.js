class ItemController {
    fixCommitmentInfo;
    serverConstants

    constructor(
        $log, $q, blockUI,
        serverConstants, fixCommitmentInfo, locale
    ) {
        this.$log = $log;
        this.$q = $q;
        this.blockUI = blockUI;

        this.serverConstants = serverConstants;
        this.locale = locale;
        this.fixCommitmentInfo = fixCommitmentInfo;
    }

    $onInit() {
        this.blockUI = this.blockUI.instances.get(`fix-commitment-info-item-${this.contact.id}`);
    }

    save() {
        this.blockUI.start();
        return this.fixCommitmentInfo.save(this.contact).finally(() => {
            this.blockUI.reset();
        });
    }

    reject() {
        this.blockUI.start();
        return this.fixCommitmentInfo.reject(this.contact).finally(() => {
            this.blockUI.reset();
        });
    }
}

const Item = {
    controller: ItemController,
    template: require('./item.html'),
    bindings: {
        contact: '<'
    }
};

export default angular.module('mpdx.tools.fix.commitmentInfo.item.component', [])
    .component('fixCommitmentInfoItem', Item).name;
