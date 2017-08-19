import defaultTo from 'lodash/fp/defaultTo';
import get from 'lodash/fp/get';

class AppealsController {
    constructor(
        $log, $rootScope,
        api
    ) {
        this.$log = $log;
        this.$rootScope = $rootScope;
        this.api = api;

        this.count = 0;

        $rootScope.$on('accountListUpdated', () => {
            this.getCount();
        });
    }
    $onInit() {
        this.getCount();
    }
    getCount() {
        return this.api.get('appeals', {
            fields: { appeals: '' },
            filter: { account_list_id: this.api.account_list_id },
            per_page: 0
        }).then((data) => {
            const count = defaultTo(0, get('meta.pagination.total_count', data));
            this.$log.debug('appeals count', count);
            this.count = count;
            return count;
        });
    }
}

const progressAppeals = {
    template: require('./appeals.html'),
    controller: AppealsController
};

import api from 'common/api/api.service';

export default angular.module('mpdx.home.progress.appeals', [
    api
]).component('progressAppeals', progressAppeals).name;
