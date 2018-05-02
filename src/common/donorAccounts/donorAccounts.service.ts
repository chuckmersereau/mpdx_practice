export class DonorAccountsService {
    constructor(
        private api: ApiService
    ) {}
    search(keywords: string): ng.IPromise<any> {
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

import api, { ApiService } from '../api/api.service';

export default angular.module('mpdx.common.donorAccounts.service', [api])
    .service('donorAccounts', DonorAccountsService).name;
