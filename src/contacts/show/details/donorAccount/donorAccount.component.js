class ContactDonorAccountController {
    contact;
    contacts;
    currentAccountList;
    donorAccount;

    constructor(
        contacts, currentAccountList
    ) {
        this.contacts = contacts;
        this.currentAccountList = currentAccountList;
    }
    remove() {
        this.donorAccount._destroy = '1';
        if (angular.isDefined(this.donorAccount.id)) {
            this.save();
        }
    }
    save() {
        if (this.donorAccount.account_number === '') { return; }
        if (!this.donorAccount.organization_id || this.donorAccount.organization_id === 0) {
            this.donorAccount.organization_id = this.currentAccountList.account_list.default_organization_id;
        }
        this.contacts.save(this.contact);
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
