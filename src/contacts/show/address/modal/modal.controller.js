import concat from 'lodash/fp/concat';
import each from 'lodash/fp/each';
import findIndex from 'lodash/fp/findIndex';
import reject from 'lodash/fp/reject';
import createPatch from '../../../../common/fp/createPatch';

class AddressModalController {
    constructor(
        $log, $scope, $timeout, $window, gettextCatalog, NgMap,
        contacts, serverConstants, users,
        contact, address
    ) {
        this.$log = $log;
        this.$scope = $scope;
        this.$timeout = $timeout;
        this.$window = $window;
        this.address = angular.copy(address);
        this.contact = contact;
        this.contacts = contacts;
        this.gettextCatalog = gettextCatalog;
        this.serverConstants = serverConstants;
        this.users = users;

        this.place = null;
        this.addressInitialState = angular.copy(address);

        NgMap.getMap().then((map) => {
            this.map = map;
            if (this.address) {
                let address = `${this.address.street}`;
                if (this.address.city) {
                    address += `, ${this.address.city}`;
                }
                if (this.address.state) {
                    address += `, ${this.address.state}`;
                }
                if (this.address.postal_code) {
                    address += `, ${this.address.postal_code}`;
                }
                this.place = { formatted_address: address };
            }
            this.refreshMap();
        });

        let $ctrl = this;
        this.updateAddress = function() { // workaround for weird bindings in google places
            $ctrl.place = this.getPlace();
            $ctrl.address.street = '';
            each((component) => {
                switch (component.types[0]) {
                    case 'subpremise':
                        $ctrl.address.street += component.long_name + '/';
                        break;
                    case 'street_number':
                        $ctrl.address.street += component.long_name + ' ';
                        break;
                    case 'route':
                        $ctrl.address.street += component.long_name;
                        break;
                    case 'administrative_area_level_1':
                        $ctrl.address.state = component.short_name;
                        break;
                    case 'administrative_area_level_2':
                        $ctrl.address.region = component.long_name;
                        break;
                    case 'administrative_area_level_3':
                        $ctrl.address.metro_area = component.long_name;
                        break;
                    case 'country':
                        $ctrl.address.country = component.long_name;
                        break;
                    case 'postal_code':
                        $ctrl.address.postal_code = component.long_name;
                        break;
                    case 'locality':
                        $ctrl.address.city = component.long_name;
                        break;
                }
            }, $ctrl.place.address_components);
            $ctrl.refreshMap();
        };

        if (this.address) {
            if (this.contact) {
                this.modalTitle = this.gettextCatalog.getString('Edit Address');
            } else {
                this.modalTitle = this.gettextCatalog.getString('Address');
            }
            this.isEditable = !this.address.remote_id && (this.address.source === 'MPDX' || this.address.source === 'manual' || this.address.source === 'TntImport');
        } else {
            this.modalTitle = this.gettextCatalog.getString('Add Address');
            this.address = { street: '', location: 'Home', source: 'MPDX' };
        }
    }
    save() {
        if (angular.isDefined(this.address.id)) {
            const addressIndex = findIndex({ id: this.address.id }, this.contact.addresses);
            this.contact.addresses[addressIndex] = angular.copy(this.address);
            const patch = createPatch(this.addressInitialState, this.address);
            this.$log.debug('address patch', patch);
            return this.contacts.saveAddress(this.contact.id, patch).then(() => {
                this.$scope.$hide();
            });
        } else {
            return this.contacts.addAddress(this.contact.id, this.address).then((data) => {
                this.contact.addresses = concat(this.contact.addresses, data);
                this.$scope.$hide();
            });
        }
    }
    reqUpdateEmailBodyRequest() {
        if (this.address.source === 'Siebel') {
            const donorAccount = this.address.source_donor_account;
            const donorName = donorAccount ? this.contact.name + ' (donor #' + donorAccount.account_number + ')' : this.contact.name;
            return `Dear Donation Services,%0D%0A%0D%0AOne of my donors, ${donorName} has a new current address.%0D%0APlease update their address to:%0D%0AREPLACE WITH NEW STREET%0D%0AREPLACE WITH NEW CITY, STATE, ZIP%0D%0A%0D%0AThanks,%0D%0A${this.users.current.first_name}`;
        }

        return '';
    }
    refreshMap() {
        const geocoder = new this.$window.google.maps.Geocoder();
        geocoder.geocode({
            address: this.place.formatted_address
        }, (results, status) => {
            if (status === 'OK' && results.length > 0) {
                this.place = results[0];
                this.$window.google.maps.event.trigger(this.map, 'resize');
                this.map.setCenter(this.place.geometry.location);
            }
        });
    }
    delete() {
        return this.contacts.deleteAddress(this.contact.id, this.address.id).then(() => {
            this.contact.addresses = reject({ id: this.address.id }, this.contact.addresses);
            this.$scope.$hide();
        });
    }
}

import contacts from 'contacts/contacts.service';
import gettextCatalog from 'angular-gettext';
import ngmap from 'ngmap';
import serverConstants from 'common/serverConstants/serverConstants.service';
import users from 'common/users/users.service';

export default angular.module('mpdx.contacts.show.address.modal.controller', [
    gettextCatalog, ngmap,
    contacts, serverConstants, users
]).controller('addressModalController', AddressModalController).name;
