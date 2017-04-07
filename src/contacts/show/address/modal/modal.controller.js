import concat from 'lodash/fp/concat';
import each from 'lodash/fp/each';
import findIndex from 'lodash/fp/findIndex';
import reject from 'lodash/fp/reject';
import createPatch from "../../../../common/fp/createPatch";

class AddressModalController {
    contact;
    contacts;
    serverConstants;

    constructor(
        $log, $scope, $timeout, $window, gettextCatalog,
        contacts, serverConstants, users,
        contact, address
    ) {
        this.$log = $log;
        this.$scope = $scope;
        this.$timeout = $timeout;
        this.$window = $window;
        this.address = address;
        this.contact = contact;
        this.contacts = contacts;
        this.gettextCatalog = gettextCatalog;
        this.serverConstants = serverConstants;
        this.users = users;
        this.maps = [];
        this.addressInitialState = angular.copy(address);

        let $ctrl = this;
        this.updateAddress = function() { //workaround for weird bindings in google places
            let updatedAddress = this.getPlace();
            $ctrl.address = {id: $ctrl.address.id, street: '', location: $ctrl.address.location || 'Home', gmap: updatedAddress};
            $ctrl.refreshMap();
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
            }, updatedAddress.address_components);
        };

        if (this.address) {
            if (this.contact) {
                this.modalTitle = this.gettextCatalog.getString('Edit Address');
            } else {
                this.modalTitle = this.gettextCatalog.getString('Address');
            }
            const geocoder = new this.$window.google.maps.Geocoder();
            geocoder.geocode({
                address: `${this.address.street} ${this.address.city}`
            }, (results, status) => {
                if (status === 'OK' && results.length > 0) {
                    this.address.gmap = results[0];
                    this.refreshMap();
                }
            });
        } else {
            this.modalTitle = this.gettextCatalog.getString('Add Address');
            this.address = { street: '', location: 'Home', source: 'MPDX' };
        }
        this.$scope.$on('mapInitialized', (evt, evtMap) => {
            this.maps.push(evtMap);
            this.refreshMap();
        });
    }
    save() {
        if (angular.isDefined(this.address.id)) {
            const addressIndex = findIndex({id: this.address.id}, this.contact.addresses);
            this.contact.addresses[addressIndex] = angular.copy(this.address);
            const patch = createPatch(this.addressInitialState, this.address);
            this.$log.debug('address patch', patch);
            return this.contacts.saveAddress(this.contact.id, patch).then((data) => {
                this.contact.addresses[addressIndex].updated_in_db_at = data.updated_in_db_at;
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
        if (this.address.source === 'DataServer') {
            const donorAccount = this.address.source_donor_account;
            const donorName = donorAccount ? this.contact.name + ' (donor #' + donorAccount.account_number + ')' : this.contact.name;
            return `Dear Donation Services,%0D%0A%0D%0AOne of my donors, ${donorName} has a new current address.%0D%0APlease update their address to:%0D%0AREPLACE WITH NEW STREET%0D%0AREPLACE WITH NEW CITY, STATE, ZIP%0D%0A%0D%0AThanks,%0D%0A${this.users.current.first_name}`;
        }

        return '';
    }
    refreshMap() {
        each(map => {
            if (this.address.gmap) {
                if (this.marker) {
                    this.marker.setMap(null);
                }
                this.marker = new this.$window.google.maps.Marker({
                    map: map,
                    position: this.address.gmap.geometry.location
                });
                this.$window.google.maps.event.trigger(map, 'resize');
                map.setCenter(this.address.gmap.geometry.location);
            }
        }, this.maps);
    }
    delete() {
        return this.contacts.deleteAddress(this.contact.id, this.address.id).then(() => {
            this.contact.addresses = reject({id: this.address.id}, this.contact.addresses);
            this.$scope.$hide();
        });
    }
}

export default angular.module('mpdx.contacts.show.address.modal.controller', [])
    .controller('addressModalController', AddressModalController).name;
