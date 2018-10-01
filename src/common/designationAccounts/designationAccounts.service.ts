import { assign, concat, find, map, reduce, toInteger } from 'lodash/fp';
import api, { ApiService } from '../api/api.service';

export class DesignationAccountsService {
    balance: number;
    data: any;
    list: any;
    organizations: any;
    selected: any;
    constructor(
        private $log: ng.ILogService,
        private $rootScope: ng.IRootScopeService,
        private $q: ng.IQService,
        private api: ApiService
    ) {
        this.data = [];
        this.balance = 0;
        this.list = [];
        this.organizations = [];
        this.selected = [];
    }
    load(reset: boolean = false): ng.IPromise<any> {
        if (!reset && this.data.length > 0) {
            return this.$q.resolve(this.data);
        }

        return this.api.get(`account_lists/${this.api.account_list_id}/designation_accounts`, {
            include: 'organization'
        }).then((data) => {
            this.$log.debug(`account_lists/${this.api.account_list_id}/designation_accounts`, data);
            this.data = data;
            this.organizations = reduce((result, value) => {
                if (!find({ id: value.organization.id }, result)) {
                    return concat(result, value.organization);
                }
                return result;
            }, [], data);
            this.$log.debug('designation organizations', this.organizations);
            this.updateBalance();
            return this.data;
        });
    }
    save(designationAccount: any): ng.IPromise<any> {
        return this.api.put({
            url: `account_lists/${this.api.account_list_id}/designation_accounts/${designationAccount.id}`,
            data: designationAccount,
            type: 'designation_accounts'
        }).then((data) => {
            this.data = map((designationAccount) => {
                return data.id === designationAccount.id ? assign(designationAccount, data) : designationAccount;
            }, this.data);
            this.updateBalance();
            return data;
        });
    }
    search(keywords: string): ng.IPromise<any> {
        return this.api.get(`account_lists/${this.api.account_list_id}/designation_accounts`, {
            filter: {
                wildcard_search: keywords
            },
            fields: {
                designation_accounts: 'display_name,designation_number'
            },
            per_page: 6
        });
    }
    updateBalance(): void {
        this.balance = reduce((result, designationAccount) =>
            result + toInteger(designationAccount.active ? designationAccount.converted_balance : 0)
            , 0, this.data);
    }
    resetSelected(): void {
        this.selected = [];
        this.$rootScope.$emit('designationAccountSelectorChanged', this.selected);
    }
}

export default angular.module('mpdx.common.designationAccounts.service', [api])
    .service('designationAccounts', DesignationAccountsService).name;
