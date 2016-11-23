class DonationsService {
    constructor(
        api
    ) {
        this.api = api;
        this.data = null;
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
}
export default angular.module('mpdx.donations.service', [])
    .service('donationsService', DonationsService).name;
