class ListController {
    data: any[];
    loading: boolean;
    meta: any;
    listLoadCount: number;
    constructor(
        private $log: ng.ILogService,
        private api: ApiService
    ) {
        this.data = [];
        this.loading = false;
        this.meta = {};
        this.listLoadCount = 0;
    }
    $onInit() {
        this.load();
    }
    load(page = 1) {
        this.loading = true;
        this.reset();
        let currentCount = angular.copy(this.listLoadCount);
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
        }).then((data: any) => {
            this.setData(data, currentCount);
            this.loading = false;
            /* istanbul ignore next */
            this.$log.debug(`coaching account lists page ${data.meta.pagination.page}`, data);
        });
    }
    reset() {
        this.meta = {};
        this.data = [];
        this.listLoadCount++;
    }
    setData(data, currentCount) {
        // ensures the last request becomes the data, not the latest response
        if (currentCount === this.listLoadCount) {
            this.meta = data.meta;
            this.data = data;
        }
    }
}

const List = {
    controller: ListController,
    template: require('./list.html')
};

import api, { ApiService } from '../../common/api/api.service';

export default angular.module('mpdx.coaches.list.component', [
    api
]).component('coachesList', List).name;
