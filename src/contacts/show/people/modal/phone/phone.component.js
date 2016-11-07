class ContactPhoneController {
    constructor() {
        this.deleted = false;
    }
    remove() {
        this.phone._destroy = 1;
        this.deleted = true;
        this.onRemove();
    }
}

const Phone = {
    controller: ContactPhoneController,
    template: require('./phone.html'),
    bindings: {
        phone: '=',
        onRemove: '&'
    }
};

export default angular.module('mpdx.contacts.show.personModal.phone.component', [])
        .component('contactPhone', Phone).name;
