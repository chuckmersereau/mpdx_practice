class ContactsController {
    constructor(
        accounts
    ) {
        this.accounts = accounts;
    }
}

const progressContacts = {
    template: require('./contacts.html'),
    controller: ContactsController
};

import accounts from 'common/accounts/accounts.service';

export default angular.module('mpdx.home.progress.contacts', [
    accounts
]).component('progressContacts', progressContacts).name;
