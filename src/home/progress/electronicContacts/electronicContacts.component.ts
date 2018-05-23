import accounts, { AccountsService } from '../../../common/accounts/accounts.service';

class ElectronicContactsController {
    constructor(
        private accounts: AccountsService
    ) {}
}

const progressElectronicContacts = {
    template: require('./electronicContacts.html'),
    controller: ElectronicContactsController
};

export default angular.module('mpdx.home.progress.electronicContacts', [
    accounts
]).component('progressElectronicContacts', progressElectronicContacts).name;
