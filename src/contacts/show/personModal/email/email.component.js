class ContactEmailAddressController {
    constructor() {
        this.deleted = false;
    }
    $onInit() {
        if (this.email.location) {
            this.email.location = this.email.location.toLowerCase();
        }
    }
    remove() {
        this.email._destroy = 1;
        this.deleted = true;
        this.onRemove();
    }
}

const Email = {
    controller: ContactEmailAddressController,
    template: require('./email.html'),
    bindings: {
        email: '=',
        onRemove: '&'
    }
};

export default angular.module('mpdx.contacts.show.personModal.email.component', [])
        .component('contactEmailAddress', Email).name;
