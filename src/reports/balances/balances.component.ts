import { reduce, toInteger } from 'lodash/fp';

class BalancesController {
    blockUI: IBlockUIService;
    converted_total: number;
    loading: boolean;
    constructor(
        private $rootScope: ng.IRootScopeService,
        blockUI: IBlockUIService,
        private designationAccounts: DesignationAccountsService
    ) {
        this.$rootScope = $rootScope;
        this.designationAccounts = designationAccounts;

        this.blockUI = blockUI.instances.get('balances');

        this.$rootScope.$on('accountListUpdated', () => {
            this.load();
        });
    }
    $onInit() {
        this.load();
    }
    load() {
        this.loading = true;
        return this.designationAccounts.load(true).then(() => {
            this.loading = false;
            this.updateTotal();
        });
    }
    onToggle(designation) {
        designation.active = !designation.active;
        this.updateTotal();
    }
    updateTotal() {
        this.converted_total = reduce((sum, designation) =>
            sum + toInteger(designation.active ? designation.converted_balance : 0)
            , 0, this.designationAccounts.data);
    }
}

const Balances = {
    controller: BalancesController,
    template: require('./balances.html')
};

import 'angular-block-ui';
import designationAccounts, { DesignationAccountsService } from '../../common/designationAccounts/designationAccounts.service';

export default angular.module('mpdx.reports.balances.component', [
    'blockUI',
    designationAccounts
]).component('balances', Balances).name;
