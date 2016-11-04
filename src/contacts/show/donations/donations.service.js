class DonationsService {
    constructor(
        api
    ) {
        this.api = api;
    }
    getDonations(contactId, page) {
        return this.api.get('donations', { contact_id: contactId, page: page });
    }
    getDonationsGraphForContact(contactId) {
        return this.api.get(`contacts/${contactId}/donations/graph`);
    }
    save(donation) {
        var donationToCommit = angular.copy(donation);
        donationToCommit.amount = donation.amount.replace(/[^\d.-]/g, '');
        return this.api.put(`donations/${donationToCommit.id}`, { donation: donationToCommit });
    }
}

export default angular.module('mpdx.contacts.show.donations.service', [])
    .service('donationsService', DonationsService).name;
