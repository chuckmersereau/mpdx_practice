class DonationsReportService {
    constructor(
        $state,
        api, session
    ) {
        this.$state = $state;
        this.api = api;
        this.data = null;
        this.session = session;
    }
    getDonations(contactId, page) {
        return this.api.get('donations', { contact_id: contactId, page: page }).then((data) => {
            if (!contactId && !page) {
                this.data = data;
            }
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
