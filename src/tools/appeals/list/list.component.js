import concat from 'lodash/fp/concat';
import defaultTo from 'lodash/fp/defaultTo';
import fixed from 'common/fp/fixed';
import reduce from 'lodash/fp/reduce';
import unionBy from 'lodash/fp/unionBy';

class ListController {
    constructor(
        $log, $rootScope,
        accounts, api
    ) {
        this.$log = $log;
        this.accounts = accounts;
        this.api = api;


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
    loadMoreAppeals() {
        return this.canLoadMore() ? this.load(this.page + 1) : null;
    }
    canLoadMore() {
        return !this.loading && this.page < this.meta.pagination.total_pages;
    }
    load(page = 1) {
        const reset = page === 1;
        let currentCount;
        if (reset) {
            this.meta = {};
            this.data = [];
            this.totals = {};
            this.listLoadCount++;
            currentCount = angular.copy(this.listLoadCount);
        }

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

        return this.api.get('appeals', params).then((data) => {
            /* istanbul ignore next */
            this.$log.debug('appeals', data);
            if (this.loadedOutOfTurn(reset, currentCount)) {
                return;
            }
            const deserializedData = this.mutateData(data);
            this.data = this.resetOrAppendData(reset, deserializedData);
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
    loadedOutOfTurn(reset, currentCount) {
        return reset && currentCount !== this.listLoadCount;
    }
    resetOrAppendData(reset, deserializedData) {
        return reset ? deserializedData : unionBy('id', this.data, deserializedData);
    }
    onPrimary(id) {
        this.accounts.current.primary_appeal = { id: id };
        this.accounts.saveCurrent();
    }
}

const List = {
    controller: ListController,
    template: require('./list.html')
};

import accounts from 'common/accounts/accounts.service';
import api from 'common/api/api.service';

export default angular.module('mpdx.tools.appeals.list.component', [
    accounts, api
]).component('appealsList', List).name;
