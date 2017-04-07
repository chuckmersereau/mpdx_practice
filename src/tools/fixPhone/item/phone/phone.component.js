import moment from 'moment';

class PhoneController {
    moment;
    modal;
    gettextCatalog;

    constructor(
        modal, gettextCatalog
    ) {
        this.moment = moment;
        this.modal = modal;
        this.gettextCatalog = gettextCatalog;
    }

    remove() {
        if (this.phone.new) {
            this.phone.number = '';
        } else {
            const message = this.gettextCatalog.getString('Are you sure you wish to delete this phone number?');
            return this.modal.confirm(message).then(() => {
                this.phone._destroy = 1;
            }, () => {});
        }
    }
}

const Phone = {
    controller: PhoneController,
    template: require('./phone.html'),
    bindings: {
        phone: '=',
        onPrimary: '&'
    }
};

export default angular.module('mpdx.tools.fixPhone.item.phone.component', [])
    .component('fixPhoneItemPhone', Phone).name;
