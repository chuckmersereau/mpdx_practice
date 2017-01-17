class DonationsReportService {
    api;
    session;

    constructor(
        $log, $state,
        api, session
    ) {
        this.$log = $log;
        this.$state = $state;
        this.api = api;
        this.data = null;
        this.session = session;
    }
    getDonations({ startDate = null, endDate = null, contactId = null, page = null }) {
        let params = {};
        params.filter = {};
        if (contactId) {
            params.filter.contactId = contactId;
        }
        if (page) {
            params.page = page;
        } else {
            params.per_page = "10000";
        }
        if (startDate && endDate) {
            params.filter.donation_date = `${startDate.format('YYYY-MM-DD')}..${endDate.format('YYYY-MM-DD')}`;
        }
        return this.api.get(`account_lists/${this.api.account_list_id}/donations`, params).then((data) => {
            this.$log.debug(`account_lists/${this.api.account_list_id}/donations`, data);
            return data;
        });
    }
    getDonationsGraphForContact(contactId) {
        return this.api.get(`contacts/${contactId}/donations/graph`);
    }
    save(donation) {
        let donationToCommit = _.clone(donation);
        donationToCommit.amount = donation.amount.replace(/[^\d.-]/g, '');
        return this.api.put(`donations/${donationToCommit.id}`, { donation: donationToCommit });
    }
    sync() {
        if (this.session.downloading) {
            return;
        }
        this.session.downloading = true;
        this.api.get('donations/sync').then(() => {
            this.$state.go('donations');
        }).finally(() => {
            this.session.downloading = false;
        });
    }
}
export default angular.module('mpdx.reports.donations.service', [])
    .service('donationsReport', DonationsReportService).name;
