class ReferralsService {
    api;
    constructor(api) {
        this.api = api;

        this.data = {};
        this.loading = true;
    }
    fetchReferrals(id) {
        this.api.get('contacts/' + id + '/referrals', {}).then((data) => {
            this.data.referrals = data.referrals;
        });
    };
}

export default angular.module('mpdx.services.referrals', [])
    .service('referralsService', ReferralsService).name;
