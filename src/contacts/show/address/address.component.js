class AddressController {
    contacts;
    constructor(
        contacts
    ) {
        this.contacts = contacts;
    }
}

const Address = {
    controller: AddressController,
    template: require('./address.html'),
    bindings: {
        address: '<',
        contact: '<',
        onPrimary: '&'
    }
};

export default angular.module('mpdx.contacts.show.address.component', [])
    .component('contactAddress', Address).name;
