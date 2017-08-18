import concat from 'lodash/fp/concat';
import reduce from 'lodash/fp/reduce';
import sumBy from 'lodash/fp/sumBy';
import unionBy from 'lodash/fp/unionBy';

class ListController {
    constructor(
        $log, $rootScope,
        api
    ) {
        this.$log = $log;
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
        if (this.loading || this.page >= this.meta.pagination.total_pages) {
            return;
        }
        this.load(this.page + 1);
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
            filter: { account_list_id: this.api.account_list_id },
            sort: '-created_at',
            page: this.page
        };

        this.loading = true;

        return this.api.get('appeals', params).then(data => {
            this.$log.debug('appeals', data);
            this.loading = false;

            if (reset && currentCount !== this.listLoadCount) { return; }
            this.meta = data.meta;

            const deserializedData = reduce((result, appeal) => {
                appeal.amount_raised = sumBy(donation =>
                    parseFloat(donation.converted_amount)
                    , appeal.donations);
                if (appeal.amount && parseFloat(appeal.amount) > 0) {
                    appeal.percentage_raised = parseInt((appeal.amount_raised / appeal.amount) * 100.0);
                } else {
                    appeal.amount = 0;
                    appeal.percentage_raised = 0;
                }
                return concat(result, appeal);
            }, [], data);

            if (reset) {
                this.data = deserializedData;
            } else {
                this.data = unionBy('id', this.data, deserializedData);
            }
            return this.data;
        }).catch(() => {
            this.loading = false;
        });
    }
}

const List = {
    controller: ListController,
    template: require('./list.html')
};

import api from 'common/api/api.service';

export default angular.module('mpdx.tools.appeals.list.component', [
    api
]).component('appealsList', List).name;
