class AddressController {
}

const Address = {
    controller: AddressController,
    template: require('./address.html'),
    bindings: {
        address: '<'
    }
};

export default angular.module('mpdx.contacts.show.address.component', [])
    .component('contactAddress', Address).name;
