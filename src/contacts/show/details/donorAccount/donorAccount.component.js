class ContactDonorAccountController {
    accounts;
    contact;
    contactsService;
    donorAccount;

    constructor(
        accounts, contactsService
    ) {
        this.accounts = accounts;
        this.contactsService = contactsService;
    }
    remove() {
        this.donorAccount._destroy = '1';
        this.save();
    }
    save() {
        if (this.donorAccount.account_number === '') { return; }
        if (!this.donorAccount.organization_id || this.donorAccount.organization_id === 0) {
            this.donorAccount.organization_id = this.accounts.current.atributes.default_organization_id;
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
