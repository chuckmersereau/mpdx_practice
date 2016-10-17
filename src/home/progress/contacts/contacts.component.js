class ContactsController {
}

const progressContacts = {
    template: require('./contacts.html'),
    controller: ContactsController,
    bindings: {
        contacts: '<'
    }
};

export default angular.module('mpdx.home.progress.contacts', [])
    .component('progressContacts', progressContacts).name;
