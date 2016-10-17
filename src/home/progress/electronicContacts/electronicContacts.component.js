class ElectronicContactsController {
}

const progressElectronicContacts = {
    template: require('./electronicContacts.html'),
    controller: ElectronicContactsController,
    bindings: {
        electronic: '<',
        email: '<',
        facebook: '<',
        textMessage: '<'
    }
};

export default angular.module('mpdx.home.progress.electronicContacts', [])
    .component('progressElectronicContacts', progressElectronicContacts).name;
