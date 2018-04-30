import { isFunction } from 'lodash/fp';

class ContactEmailAddressController {
    deleted: boolean;
    email: any;
    onRemove: any;
    constructor() {
        this.deleted = false;
    }
    $onInit() {
        if (this.email.location) {
            this.email.location = this.email.location.toLowerCase();
        } else {
            this.email.location = 'other';
        }
    }
    remove() {
        this.deleted = true;
        if (isFunction(this.onRemove)) {
            this.onRemove();
        }
    }
}

const Email = {
    controller: ContactEmailAddressController,
    template: require('./email.html'),
    bindings: {
        email: '=',
        onRemove: '&',
        onPrimary: '&',
        onHistoric: '&'
    }
};

export default angular.module('mpdx.contacts.show.personModal.email.component', [])
    .component('contactEmailAddress', Email).name;
