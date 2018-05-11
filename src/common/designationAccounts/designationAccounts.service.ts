import { concat, find, reduce } from 'lodash/fp';
import api, { ApiService } from '../api/api.service';

export class DesignationAccountsService {
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
            return this.data;
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
    resetSelected(): void {
        this.selected = [];
        this.$rootScope.$emit('designationAccountSelectorChanged', this.selected);
    }
}

export default angular.module('mpdx.common.designationAccounts.service', [api])
    .service('designationAccounts', DesignationAccountsService).name;
