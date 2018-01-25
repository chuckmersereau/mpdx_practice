import { unionBy } from 'lodash/fp';

class ListController {
    constructor(
        $log,
        api
    ) {
        this.$log = $log;
        this.api = api;

        this.data = [];
        this.loading = false;
        this.meta = {};
        this.listLoadCount = 0;
        this.page = 1;
    }
    $onInit() {
        this.load();
    }
    load(page = 1, reset = page === 1) {
        this.loading = true;
        if (reset) {
            this.reset();
        }
        let currentCount;
        currentCount = angular.copy(this.listLoadCount);
        this.page = page;
        return this.api.get({
            url: 'coaching/account_lists',
            data: {
                page: page,
                per_page: 10,
                include: 'users',
                fields: {
                    users: 'first_name,last_name,avatar'
                }
            },
            type: 'account_lists'
        }).then((data) => {
            this.loading = false;
            /* istanbul ignore next */
            this.$log.debug(`coaching account lists page ${data.meta.pagination.page}`, data);
            this.setData(data, reset, currentCount);
        });
    }
    reset() {
        this.meta = {};
        this.data = [];
        this.listLoadCount++;
    }
    setData(data, reset, currentCount) {
        if (currentCount === this.listLoadCount) {
            this.meta = data.meta;
            if (reset) {
                this.data = data;
            } else {
                this.data = unionBy('id', this.data, data);
            }
        }
    }
    loadMoreCoachingAccountLists() {
        if (this.loading || (this.meta.pagination && this.page >= this.meta.pagination.total_pages)) {
            return;
        }
        this.load(this.page + 1);
    }
}

const List = {
    controller: ListController,
    template: require('./list.html')
};

import api from 'common/api/api.service';

export default angular.module('mpdx.coaches.list.component', [
    api
]).component('coachesList', List).name;
