import isFunction from 'lodash/fp/isFunction';

class ContactPhoneController {
    constructor() {
        this.deleted = false;
    }
    $onInit() {
        if (this.phone.location) {
            this.phone.location = this.phone.location.toLowerCase();
        } else {
            this.phone.location = 'other';
        }
    }
    remove() {
        this.deleted = true;
        if (isFunction(this.onRemove)) {
            this.onRemove();
        }
    }
}

const Phone = {
    controller: ContactPhoneController,
    template: require('./phone.html'),
    bindings: {
        phone: '=',
        onRemove: '&',
        onPrimary: '&',
        onHistoric: '&'
    }
};

export default angular.module('mpdx.contacts.show.personModal.phone.component', [])
        .component('contactPhone', Phone).name;
