class DonationsService {
    api;

    constructor(
        api
    ) {
        this.api = api;
    }
    getDonations(contactId, page) {
        return this.api.get('donations', { contact_id: contactId, page: page, per_page: 25 });
    }
    getDonationsGraphForContact(contactId) {
        return this.api.get(`contacts/${contactId}/donations/graph`); //TODO: API V2
    }
    // save(donation) {
    //     let donationToCommit = angular.copy(donation);
    //     donationToCommit.amount = donation.amount.replace(/[^\d.-]/g, '');
    //     return this.api.put(`donations/${donationToCommit.id}`, { donation: donationToCommit });
    // }
}

export default angular.module('mpdx.contacts.show.donations.service', [])
    .service('contactDonations', DonationsService).name;
