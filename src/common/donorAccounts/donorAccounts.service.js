class DonorAccountsService {
    constructor(
        api
    ) {
        this.api = api;
    }

    search(keywords) {
        return this.api.get(
            `account_lists/${this.api.account_list_id}/donor_accounts`,
            {
                filter: {
                    wildcard_search: keywords
                },
                fields: {
                    donor_accounts: 'display_name,account_number'
                },
                per_page: 6
            }
        );
    }
}

import api from 'common/api/api.service';

export default angular.module('mpdx.common.donorAccounts.service', [api])
    .service('donorAccounts', DonorAccountsService).name;
