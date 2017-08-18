import concat from 'lodash/fp/concat';
import find from 'lodash/fp/find';
import reduce from 'lodash/fp/reduce';

class DesignationAccountsService {
    constructor(
        $log,
        api
    ) {
        this.$log = $log;
        this.api = api;

        this.data = [];
        this.list = [];
        this.organizations = [];
    }

    load(reset = false) {
        if (!reset && this.data.length > 0) {
            return Promise.resolve(this.data);
        }

        return this.api.get(`account_lists/${this.api.account_list_id}/designation_accounts`, {
            include: 'organization'
        }).then(data => {
            this.$log.debug(`account_lists/${this.api.account_list_id}/designation_accounts`, data);
            this.data = data;
            this.organizations = reduce((result, value) => {
                if (!find({ id: value.organization.id }, result)) {
                    return concat(result, value.organization);
                }
                return result;
            }, [], data);
            this.$log.debug('designation organizations', this.organizations);
            return this.data;
        });
    }

    search(keywords) {
        return this.api.get(`account_lists/${this.api.account_list_id}/designation_accounts`, {
            filter: {
                wildcard_search: keywords
            },
            fields: {
                designation_accounts: 'display_name,designation_number'
            },
            per_page: 6
        });
    }
}

import api from 'common/api/api.service';

export default angular.module('mpdx.common.designationAccounts.service', [api])
    .service('designationAccounts', DesignationAccountsService).name;
