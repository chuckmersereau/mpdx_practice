import config from 'config';
import {
    compact,
    concat,
    defaultTo,
    findIndex,
    join,
    reduce,
    reject
} from 'lodash/fp';
import createPatch from 'common/fp/createPatch';

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
        // null is for unit tests
        this.autocompleteService = config.env === 'test' ? null : new $window.google.maps.places.AutocompleteService();
        this.modalTitle = this.setTitle(this.address, this.contact);

        if (this.address) {
            const fields = [this.address.street, this.address.city, this.address.state, this.address.postal_code];
            const formattedAddress = join(', ', compact(fields));
            this.place = { formatted_address: formattedAddress };
            this.isEditable = !this.address.remote_id
                && ['MPDX', 'manual', 'TntImport'].indexOf(this.address.source) > -1;
        } else {
            this.address = { street: '', location: 'Home', source: 'MPDX' };
        }

        NgMap.getMap().then((map) => {
            this.placesService = config.env === 'test' ? null : new $window.google.maps.places.PlacesService(map);
            this.map = map;
            this.refreshMap();
        });
    }
    setTitle(address, contact) {
        return this.gettextCatalog.getString(address
            ? contact
                ? 'Edit Address'
                : 'Address'
            : 'Add Address'
        );
    }
    updateAddress(address) {
        this.placesService.getDetails({ placeId: address.place_id }, (data) => {
            this.place = data;
            this.address = this.parsePlace(data);
            this.addressResults = undefined;
            this.refreshMap();
            this.$timeout(this.$scope.$digest()); // callback doesn't fire $digest
        });
    }
    parsePlace(data) {
        return reduce((result, value) => {
            switch (value.types[0]) {
                case 'subpremise':
                    result.street += value.long_name + '/';
                    break;
                case 'street_number':
                    result.street += value.long_name + ' ';
                    break;
                case 'route':
                    result.street += value.long_name;
                    break;
                case 'administrative_area_level_1':
                    result.state = value.short_name;
                    break;
                case 'administrative_area_level_2':
                    result.region = value.long_name;
                    break;
                case 'administrative_area_level_3':
                    result.metro_area = value.long_name;
                    break;
                case 'country':
                    result.country = value.long_name;
                    break;
                case 'postal_code':
                    result.postal_code = value.long_name;
                    break;
                case 'locality':
                    result.city = value.long_name;
                    break;
            }
            return result;
        }, {
            street: '',
            location: defaultTo('Home', this.address.location),
            source: defaultTo('MPDX', this.address.source)
        }, data.address_components);
    }
    streetKeyUp(event) {
        const noReturn = event.currentTarget.value.indexOf('\n') === -1;
        if (event.key === 'Escape') {
            this.addressResults = null;
        } else if (event.key !== 'Enter' && noReturn) {
            this.autocompleteService.getPlacePredictions({ input: event.currentTarget.value }, (results) => {
                this.addressResults = results;
                this.$log.debug('address query results', this.addressResults);
            });
        } else if (noReturn) {
            this.addressResults = null;
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

export default angular.module('mpdx.contacts.show.addresses.address.modal.controller', [
    gettextCatalog, ngmap,
    contacts, serverConstants, users
]).controller('addressModalController', AddressModalController).name;
