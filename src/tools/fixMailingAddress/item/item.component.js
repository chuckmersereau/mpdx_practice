import map from 'lodash/fp/map';
import isEmpty from 'lodash/fp/isEmpty';

class FixMailingAddressItemController {
    contacts;

    constructor(
        $log, $q,
        contacts
    ) {
        this.$log = $log;
        this.$q = $q;
        this.contacts = contacts;
    }

    save() {
        let addressToSave = null;
        let promises = [];

        _.each(this.contact.addresses, (address) => {
            address.valid_values = true;

            if (address.new) {
                addressToSave = address;
            } else {
                let promise = this.$q.defer();
                promises.push(promise.promise);

                if (address._destroy === 1) {
                    this.service.deleteAddress(this.contact, address).then(() => {
                        this.$log.debug('deleteAddress: ', address.street);

                        promise.resolve();
                    });
                } else {
                    this.contacts.saveAddress(this.contact.id, address).then((data) => {
                        this.$log.debug('saveAddress');
                        this.$log.debug(data);

                        promise.resolve();
                    });
                }
            }
        });

        let promise = this.$q.defer();

        this.$q.all(promises).then(() => {
            if (addressToSave && !isEmpty(addressToSave.street)) {
                this.contacts.addAddress(this.contact.id, addressToSave).then((data) => {
                    this.$log.debug('addAddress');
                    this.$log.debug(data);

                    promise.resolve();
                });
            } else {
                promise.resolve();
            }
        });

        return promise.promise.then(() => {
            this.contact.hidden = true;
            this.service.meta.pagination.total_count--;
        });
    }

    changePrimary(id) {
        this.contact.addresses = map(val => {
            val.primary_mailing_address = val.id === id;
            return val;
        }, this.contact.addresses);
    }
}

const FixMailingAddressItem = {
    controller: FixMailingAddressItemController,
    template: require('./item.html'),
    bindings: {
        contact: '=',
        service: '='
    }
};

export default angular.module('mpdx.tools.fixMailingAddress.item.component', [])
    .component('fixMailingAddressItem', FixMailingAddressItem).name;