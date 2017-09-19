class ElectronicContactsController {
    constructor(
        accounts
    ) {
        this.accounts = accounts;
    }
}

const progressElectronicContacts = {
    template: require('./electronicContacts.html'),
    controller: ElectronicContactsController
};

import accounts from 'common/accounts/accounts.service';

export default angular.module('mpdx.home.progress.electronicContacts', [
    accounts
]).component('progressElectronicContacts', progressElectronicContacts).name;
