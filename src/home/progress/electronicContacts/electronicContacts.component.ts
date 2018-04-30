class ElectronicContactsController {
    constructor(
        private accounts: AccountsService
    ) {}
}

const progressElectronicContacts = {
    template: require('./electronicContacts.html'),
    controller: ElectronicContactsController
};

import accounts, { AccountsService } from '../../../common/accounts/accounts.service';

export default angular.module('mpdx.home.progress.electronicContacts', [
    accounts
]).component('progressElectronicContacts', progressElectronicContacts).name;
