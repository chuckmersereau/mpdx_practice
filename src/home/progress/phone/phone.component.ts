class PhoneController {
    constructor(
        private accounts: AccountsService
    ) {}
}

const progressPhoneDials = {
    template: require('./phone.html'),
    controller: PhoneController
};

import accounts, { AccountsService } from '../../../common/accounts/accounts.service';

export default angular.module('mpdx.home.progress.phone.component', [
    accounts
]).component('progressPhoneDials', progressPhoneDials).name;
