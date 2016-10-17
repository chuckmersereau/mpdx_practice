class ContactsController {
    constructor() {

    }
}

var progressContacts = {
    template: require('./contacts.html'),
    controller: ContactsController,
    bindings: {
        contacts: '<'
    }
};
angular.module('mpdx.home.progress.contacts', [])
    .component('progressContacts', progressContacts)
