import moment from 'moment';

class AddressController {
    moment;
    modal;
    gettextCatalog;

    constructor(
        $q, modal, gettextCatalog
    ) {
        this.moment = moment;
        this.$q = $q;
        this.modal = modal;
        this.gettextCatalog = gettextCatalog;
    }

    addressSummary() {
        let summary = this.address.street;

        if (!this.address.street) {
            return '';
        }

        if (this.address.city) {
            summary += `, ${this.address.city}`;
        }
        if (this.address.state) {
            summary += ` ${this.address.state}`;
        }
        if (this.address.postal_code) {
            summary += `. ${this.address.postal_code}`;
        }

        return summary;
    }

    remove() {
        if (this.address.new) {
            this.address.street = '';
            this.address.city = '';
            this.address.state = '';
            this.address.country = '';
            this.address.region = '';
            this.address.metro_area = '';
            this.address.postal_code = '';
        } else {
            let message = this.gettextCatalog.getString('Are you sure you want to delete the following address for ');
            message += this.contact.name + '?';
            const summary = this.addressSummary();

            let promise = this.$q.defer();
            const params = {
                template: require('./modal/confirm/confirm.html'),
                controller: 'addressConfirmController',
                locals: {
                    summary: summary,
                    message: message,
                    confirmPromise: promise,
                    title: this.gettextCatalog.getString('Confirm Address Deletion')
                }
            };
            this.modal.open(params);

            return promise.promise.then(() => {
                this.address._destroy = 1;
            }, () => {
            });
        }
    }

    openModal() {
        let promise = this.$q.defer();

        this.modal.open({
            template: require('./modal/modal.html'),
            controller: 'modalController',
            locals: {
                contact: this.contact,
                address: this.address
            },
            onHide: () => {
                promise.resolve();
            }
        });
        return promise.promise;
    }
}

const Address = {
    controller: AddressController,
    template: require('./address.html'),
    bindings: {
        contact: '=',
        address: '=',
        onPrimary: '&'
    }
};

export default angular.module('mpdx.tools.fixMailingAddress.item.address.component', [])
    .component('fixMailingAddressItemAddress', Address).name;
