class ContactPhoneController {
    constructor() {
        this.deleted = false;
    }
    remove() {
        this.deleted = true;
        this.onRemove();
    }
}

const Phone = {
    controller: ContactPhoneController,
    template: require('./phone.html'),
    bindings: {
        phone: '=',
        onRemove: '&',
        onPrimary: '&'
    }
};

export default angular.module('mpdx.contacts.show.personModal.phone.component', [])
        .component('contactPhone', Phone).name;
