import defaultTo from 'lodash/fp/defaultTo';
import get from 'lodash/fp/get';

class AppealsService {
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

    search(keywords) {
        return this.api.get(`appeals`, {
            filter: {
                wildcard_search: keywords,
                account_list_id: this.api.account_list_id
            },
            fields: {
                appeals: 'name'
            },
            sort: '-created_at',
            per_page: 6
        });
    }
}

import api from '../api/api.service';

export default angular.module('mpdx.common.appeals.service', [
    api
]).service('appeals', AppealsService).name;
