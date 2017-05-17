import defaultTo from 'lodash/fp/defaultTo';
import get from 'lodash/fp/get';

class AppealsService {
    api;
    data;

    constructor(
        $rootScope, $log,
        api
    ) {
        this.$rootScope = $rootScope;
        this.$log = $log;
        this.api = api;
    }
    getCount() {
        return this.api.get('appeals', {
            fields: {appeals: ''},
            filter: {account_list_id: this.api.account_list_id},
            per_page: 0
        }).then((data) => {
            const count = defaultTo(0, get('meta.pagination.total_count', data));
            this.$log.debug(`appeals count`, count);
            return count;
        });
    }
    getList() {
        return this.api.get('appeals', {
            fields: {appeals: 'name'},
            filter: {account_list_id: this.api.account_list_id},
            per_page: 1000
        }).then((data) => {
            this.$log.debug(`appeals`, data);
            return data;
        });
    }
}

import api from '../api/api.service';

export default angular.module('mpdx.common.appeals.service', [
    api
]).service('appeals', AppealsService).name;
