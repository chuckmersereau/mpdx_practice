import 'angular-block-ui';
import accounts, { AccountsService } from '../../common/accounts/accounts.service';
import designationAccounts, { DesignationAccountsService } from '../../common/designationAccounts/designationAccounts.service';

class BalancesController {
    blockUI: IBlockUIService;
    converted_total: number;
    loading: boolean;
    constructor(
        private $rootScope: ng.IRootScopeService,
        blockUI: IBlockUIService,
        private accounts: AccountsService,
        private designationAccounts: DesignationAccountsService
    ) {
        this.$rootScope = $rootScope;
        this.blockUI = blockUI.instances.get('balances');
        this.$rootScope.$on('accountListUpdated', () => {
            this.load();
        });
    }
    $onInit(): void {
        this.load();
    }
    load(): ng.IPromise<any> {
        this.loading = true;
        return this.designationAccounts.load(true).then(() => {
            this.loading = false;
        });
    }
    onToggle(designationAccount): ng.IPromise<any> {
        designationAccount.active = !designationAccount.active;
        return this.designationAccounts.save(designationAccount);
    }
}

const Balances = {
    controller: BalancesController,
    template: require('./balances.html')
};

export default angular.module('mpdx.reports.balances.component', [
    'blockUI',
    accounts,
    designationAccounts
]).component('balances', Balances).name;
