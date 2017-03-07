import flatten from 'lodash/fp/flatten';
import map from 'lodash/fp/map';

class DonorAccountsService {
    api;
    data;

    constructor(
        $rootScope, $q, $log, api
    ) {
        this.$log = $log;
        this.api = api;
        this.$q = $q;

        this.list = [];

        $rootScope.$on('accountListUpdated', () => {
            this.getList(true);
        });
    }
    getList(reset = false) {
        if (!reset && this.list.length > 0) {
            return this.$q.resolve(this.list);
        }

        const params = {
            fields: {contacts: 'name,donor_accounts', donor_accounts: 'account_number'},
            include: 'donor_accounts',
            sort: 'name',
            filter: {account_list_id: this.api.account_list_id},
            per_page: 10000
        };

        return this.api.get(`contacts`, params).then((data) => {
            this.list = flatten(map(contact => {
                return map(donorAccount => {
                    return {
                        id: donorAccount.id,
                        name: contact.name,
                        account_number: donorAccount.account_number
                    };
                }, contact.donor_accounts);
            }, data));
            this.$log.debug(`account_lists/${this.api.account_list_id}/donor_accounts`, this.list);
            return this.list;
        });
    }
}

export default angular.module('mpdx.common.donorAccounts.service', [])
    .service('donorAccounts', DonorAccountsService).name;
