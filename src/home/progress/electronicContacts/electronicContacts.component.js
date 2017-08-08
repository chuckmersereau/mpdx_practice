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

export default angular.module('mpdx.home.progress.electronicContacts', [])
    .component('progressElectronicContacts', progressElectronicContacts).name;
