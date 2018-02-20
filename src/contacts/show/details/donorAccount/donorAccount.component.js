class ContactDonorAccountController {
    constructor(
        gettext,
        accounts, contacts, session
    ) {
        this.accounts = accounts;
        this.contacts = contacts;
        this.gettext = gettext;
        this.session = session;
    }
    remove() {
        this.donorAccount._destroy = '1';
        this.save();
    }
    save() {
        if (!this.accounts.current) {
            const message = this.gettext('A serious error has occurred. Please refresh your browser or try logging out.');
            this.session.errors.push({
                message: message
            });
            return;
        }
        if (this.donorAccount.account_number === '') {
            return;
        }
        if (!this.donorAccount.organization_id || this.donorAccount.organization_id === 0) {
            this.donorAccount.organization_id = this.accounts.current.default_organization_id;
        }
        this.onSave();
    }
}
const DonorAccount = {
    controller: ContactDonorAccountController,
    template: require('./donorAccount.html'),
    bindings: {
        contact: '<',
        donorAccount: '=',
        onSave: '&'
    }
};

import accounts from 'common/accounts/accounts.service';
import contacts from 'contacts/contacts.service';
import gettext from 'angular-gettext';

export default angular.module('mpdx.contacts.show.details.donorAccount.component', [
    gettext,
    accounts, contacts
]).component('contactDonorAccount', DonorAccount).name;
