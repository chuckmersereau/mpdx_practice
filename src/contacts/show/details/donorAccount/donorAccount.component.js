class ContactDonorAccountController {
    contact;
    contactsService;
    currentAccountList;
    donorAccount;

    constructor(
        contactsService, currentAccountList
    ) {
        this.contactsService = contactsService;
        this.currentAccountList = currentAccountList;
    }
    remove() {
        this.donorAccount._destroy = '1';
        this.save();
    }
    save() {
        if (this.donorAccount.account_number === '') { return; }
        if (!this.donorAccount.organization_id || this.donorAccount.organization_id === 0) {
            this.donorAccount.organization_id = this.currentAccountList.data.default_organization_id;
        }
        this.contactsService.save(this.contact);
    }
}
const DonorAccount = {
    controller: ContactDonorAccountController,
    template: require('./donorAccount.html'),
    bindings: {
        contact: '<',
        donorAccount: '='
    }
};

export default angular.module('mpdx.contacts.show.details.donorAccount.component', [])
    .component('contactDonorAccount', DonorAccount).name;
