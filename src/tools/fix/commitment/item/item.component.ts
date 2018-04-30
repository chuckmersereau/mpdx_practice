class ItemController {
    contact: any;
    constructor(
        private blockUI: IBlockUIService,
        private serverConstants: ServerConstantsService,
        private fixCommitmentInfo: FixCommitmentInfoService
    ) {}
    $onInit() {
        this.blockUI = this.blockUI.instances.get(`fix-commitment-info-item-${this.contact.id}`);
    }
    save() {
        this.blockUI.start();
        return this.fixCommitmentInfo.save(this.contact).then(() => {
            this.blockUI.reset();
        });
    }
    reject() {
        this.blockUI.start();
        return this.fixCommitmentInfo.reject(this.contact).then(() => {
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

import 'angular-block-ui';
import serverConstants, { ServerConstantsService } from '../../../../common/serverConstants/serverConstants.service';
import fixCommitmentInfo, { FixCommitmentInfoService } from '../commitment.service';
import locale from '../../../../common/locale/locale.service';

export default angular.module('mpdx.tools.fix.commitmentInfo.item.component', [
    'blockUI',
    serverConstants, fixCommitmentInfo, locale
]).component('fixCommitmentInfoItem', Item).name;
