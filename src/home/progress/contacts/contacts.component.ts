import accounts, { AccountsService } from '../../../common/accounts/accounts.service';

class ContactsController {
    constructor(
        private accounts: AccountsService
    ) {
        this.accounts = accounts;
    }
}

const progressContacts = {
    template: require('./contacts.html'),
    controller: ContactsController
};

export default angular.module('mpdx.home.progress.contacts', [
    accounts
]).component('progressContacts', progressContacts).name;
