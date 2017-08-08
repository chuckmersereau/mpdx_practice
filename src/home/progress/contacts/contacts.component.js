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

export default angular.module('mpdx.home.progress.contacts', [])
    .component('progressContacts', progressContacts).name;
