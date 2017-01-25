class PhoneDialsController {
    accounts;
    constructor(
        accounts
    ) {
        this.accounts = accounts;
    }
}

const progressPhoneDials = {
    template: require('./phoneDials.html'),
    controller: PhoneDialsController
};

export default angular.module('mpdx.home.progress.phoneDials', [])
    .component('progressPhoneDials', progressPhoneDials).name;
