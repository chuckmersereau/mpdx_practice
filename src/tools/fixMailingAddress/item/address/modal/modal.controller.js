import find from 'lodash/fp/find';

class ModalController {
    contacts;

    constructor(
        $log, $scope, $q, gettextCatalog,
        contacts,
        contact, address
    ) {
        this.$log = $log;
        this.$scope = $scope;
        this.$q = $q;
        this.address = address;
        this.contact = contact;
        this.contacts = contacts;
        this.gettextCatalog = gettextCatalog;

        if (this.address.id) {
            this.title = this.gettextCatalog.getString('Address Change for ') + this.contact.name;
        } else {
            this.title = this.gettextCatalog.getString('Add Address');
        }
    }

    save() {
        let promise = this.$q.defer();
        this.$scope.$hide();
        promise.resolve();
        return promise.promise;
    }

    reqUpdateEmailBodyRequest() {
        if (this.address.remote_id) {
            const donorAccount = find({id: this.address.source_donor_account_id}, this.contact.donor_accounts);
            const donorName = donorAccount ? donorAccount.name + ' (donor #' + donorAccount.account_number + ')' : this.contact.name;
            return `Dear Donation Services,\n\n One of my donors, ${donorName} has a new current address.\n\n
                Please update their address to:\n\n REPLACE WITH NEW STREET\n REPLACE WITH NEW CITY, STATE, ZIP\n\n
                Thanks!\n\n`;
        }

        return '';
    }
}

export default angular.module('mpdx.tools.fixMailingAddress.item.address.modal.controller', [])
    .controller('modalController', ModalController).name;
