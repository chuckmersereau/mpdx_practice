import moment from 'moment';

class EmailController {
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
        if (this.email.new) {
            this.email.email = '';
        } else {
            const message = this.gettextCatalog.getString('Are you sure you wish to delete this email address?');
            return this.modal.confirm(message).then(() => {
                this.email._destroy = 1;
            }, () => {
            });
        }
    }
}

const Email = {
    controller: EmailController,
    template: require('./email.html'),
    bindings: {
        email: '=',
        onPrimary: '&'
    }
};

export default angular.module('mpdx.tools.fixEmailAddress.item.email.component', [])
    .component('fixEmailAddressItemEmail', Email).name;
