class DesignationAccountsService {
    api;
    data;

    constructor(
        $log,
        api
    ) {
        this.$log = $log;
        this.api = api;

        this.data = [];
        this.list = [];
    }

    load(reset = false) {
        if (!reset && this.data.length > 0) {
            return Promise.resolve(this.data);
        }

        return this.api.get(`account_lists/${this.api.account_list_id}/designation_accounts`).then((data) => {
            this.$log.debug(`account_lists/${this.api.account_list_id}/designation_accounts`, data);
            this.data = data;
            return this.data;
        });
    }

    search(keywords) {
        return this.api.get(
            `account_lists/${this.api.account_list_id}/designation_accounts`,
            {
                filter: {
                    wildcard_search: keywords
                },
                fields: {
                    designation_accounts: 'display_name,designation_number'
                },
                per_page: 6
            }
        );
    }
}

import api from 'common/api/api.service';

export default angular.module('mpdx.common.designationAccounts.service', [api])
    .service('designationAccounts', DesignationAccountsService).name;
