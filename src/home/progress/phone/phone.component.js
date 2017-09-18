class PhoneController {
    constructor(
        accounts
    ) {
        this.accounts = accounts;
    }
}

const progressPhoneDials = {
    template: require('./phone.html'),
    controller: PhoneController
};

import accounts from 'common/accounts/accounts.service';

export default angular.module('mpdx.home.progress.phone.component', [
    accounts
]).component('progressPhoneDials', progressPhoneDials).name;
