import { concat, defaultTo, reduce } from 'lodash/fp';
import fixed from '../../../common/fp/fixed';

class ListController {
    data: any[];
    enableNext: boolean;
    listLoadCount: number;
    loading: boolean;
    meta: any;
    page: number;
    pageSize: number;
    totals: any;
    constructor(
        private $log: ng.ILogService,
        $rootScope: ng.IRootScopeService,
        private gettext: ng.gettext.gettextFunction,
        private accounts: AccountsService,
        private appeals: AppealsService,
        private api: ApiService
    ) {
        this.enableNext = false;
        this.data = [];
        this.listLoadCount = 0;
        this.loading = false;
        this.meta = {};
        this.page = 0;
        this.pageSize = 0;

        $rootScope.$on('accountListUpdated', () => {
            this.load();
        });
    }
    $onInit() {
        this.load();
    }
    load(page = 1) {
        this.meta = {};
        this.data = [];
        this.totals = {};
        this.listLoadCount++;
        let currentCount = angular.copy(this.listLoadCount);

        this.page = page;

        let params = {
            fields: {
                appeals: 'amount,name,pledges_amount_not_received_not_processed,pledges_amount_processed,pledges_amount_received_not_processed'
            },
            filter: { account_list_id: this.api.account_list_id },
            sort: '-created_at',
            page: this.page
        };

        this.loading = true;

        return this.api.get('appeals', params).then((data: any) => {
            /* istanbul ignore next */
            this.$log.debug('appeals', data);
            if (this.loadedOutOfTurn(currentCount)) {
                return;
            }
            this.data = this.mutateData(data);
            this.meta = data.meta;
            this.loading = false;
            return this.data;
        }).catch((ex) => {
            this.loading = false;
            throw ex;
        });
    }
    mutateData(data) {
        return reduce((result, appeal) => {
            appeal.pledges_amount_processed = defaultTo(0, appeal.pledges_amount_processed);
            appeal.pledges_amount_processed = fixed(2, appeal.pledges_amount_processed);
            appeal.amount = defaultTo(0, appeal.amount);
            appeal.amount = fixed(2, appeal.amount);
            return concat(result, appeal);
        }, [], data);
    }
    loadedOutOfTurn(currentCount) {
        return currentCount !== this.listLoadCount;
    }
}

const List = {
    controller: ListController,
    template: require('./list.html')
};

import appeals, { AppealsService } from '../appeals.service';
import 'angular-gettext';
import accounts, { AccountsService } from '../../../common/accounts/accounts.service';
import api, { ApiService } from '../../../common/api/api.service';

export default angular.module('mpdx.tools.appeals.list.component', [
    'gettext',
    accounts, appeals, api
]).component('appealsList', List).name;
