import 'angular-gettext';
import 'ngmap';
import {
    compact,
    concat,
    defaultTo,
    findIndex,
    get,
    join,
    reduce,
    reject
} from 'lodash/fp';
import config from '../../../../../config';
import contacts, { ContactsService } from '../../../../contacts.service';
import createPatch from '../../../../../common/fp/createPatch';
import serverConstants, { ServerConstantsService } from '../../../../../common/serverConstants/serverConstants.service';
import users, { UsersService } from '../../../../../common/users/users.service';

class AddressModalController {
    address: any;
    addressInitialState: any;
    addressResults: any;
    autocompleteService: any;
    isEditable: boolean;
    map: any;
    modalTitle: string;
    place: any;
    placesService: any;
    sessionToken: string;
    constructor(
        private $log: ng.ILogService,
        private $scope: mgcrea.ngStrap.modal.IModalScope,
        private $timeout: ng.ITimeoutService,
        private $window: ng.IWindowService,
        private gettextCatalog: ng.gettext.gettextCatalog,
        private NgMap: angular.map.INgMap,
        private contacts: ContactsService,
        private serverConstants: ServerConstantsService,
        private users: UsersService,
        private contact: any,
        address: any
    ) {
        this.address = angular.copy(address);
        this.place = null;
        this.addressInitialState = angular.copy(address);
        // null is for unit tests
        const isTestEnv = config.env === 'test';
        this.autocompleteService = isTestEnv ? null : new $window.google.maps.places.AutocompleteService();
        this.sessionToken = isTestEnv ? null : new $window.google.maps.places.AutocompleteSessionToken();
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
    setTitle(address: any, contact?: any) {
        return get('id', address)
            ? contact
                ? this.gettextCatalog.getString('Edit Address')
                : this.gettextCatalog.getString('Address')
            : this.gettextCatalog.getString('Add Address');
    }
    updateAddress(address) {
        this.placesService.getDetails({ placeId: address.place_id }, (data) => {
            this.place = data;
            this.address = this.parsePlace(data);
            this.addressResults = undefined;
            this.refreshMap();
            this.$timeout(() => this.$scope.$digest()); // callback doesn't fire $digest
        });
    }
    parsePlace(data) {
        return reduce((result: any, value) => {
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
            this.autocompleteService.getPlacePredictions({
                input: event.currentTarget.value,
                sessionToken: this.sessionToken
            }, (results) => {
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
            const donorName = donorAccount
                ? this.contact.name + ' (ministry partner #' + donorAccount.account_number + ')'
                : this.contact.name;
            const previousAddress = this.address.street
                ? `, previously located at:%0D%0A${this.address.street}%0D%0A${this.address.city}, ${this.address.state} ${this.address.postal_code},%0D%0A`
                : ' ';
            return `Dear Donation Services,%0D%0A%0D%0AOne of my ministry partners, ${donorName}${previousAddress}has a new current address.%0D%0APlease update their address to:%0D%0AREPLACE WITH NEW STREET%0D%0AREPLACE WITH NEW CITY, STATE, ZIP%0D%0A%0D%0AThanks,%0D%0A${this.users.current.first_name}`;
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

export default angular.module('mpdx.contacts.show.addresses.address.modal.controller', [
    'gettext', 'ngMap',
    contacts, serverConstants, users
]).controller('addressModalController', AddressModalController).name;
