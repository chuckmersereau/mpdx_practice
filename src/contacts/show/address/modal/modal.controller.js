class AddressModalController {
    contact;
    contacts;
    serverConstants;

    constructor(
        $scope, $timeout, $window,
        contacts, serverConstants,
        contact, address
    ) {
        this.$scope = $scope;
        this.$timeout = $timeout;
        this.$window = $window;
        this.address = address;
        this.contact = contact;
        this.contacts = contacts;
        this.serverConstants = serverConstants;

        this.maps = [];

        let $ctrl = this;
        this.updateAddress = function() { //workaround for weird bindings in google places
            let updatedAddress = this.getPlace();
            $ctrl.address = {id: $ctrl.address.id, street: '', location: $ctrl.address.location || 'Home', gmap: updatedAddress};
            $ctrl.refreshMap();
            _.each(updatedAddress.address_components, (component) => {
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
                        $ctrl.address.metro = component.long_name;
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
            });
        };

        if (angular.isDefined(this.address)) {
            this.modalTitle = 'Edit Address';
            let geocoder = new this.$window.google.maps.Geocoder();
            geocoder.geocode({
                address: `${this.address.street} ${this.address.city}`
            }, (results, status) => {
                if (status === 'OK' && results.length > 0) {
                    this.address.gmap = results[0];
                    this.refreshMap();
                }
            });
        } else {
            this.modalTitle = 'Add Address';
            this.address = { street: '', location: 'Home' };
        }
        this.$scope.$on('mapInitialized', function(evt, evtMap) {
            this.maps.push(evtMap);
            this.refreshMap();
        }.bind(this));
    }
    save() {
        if (angular.isDefined(this.address.id)) {
            const addressIndex = _.findIndex(this.contact.addresses, {id: this.address.id});
            this.contact.addresses[addressIndex] = angular.copy(this.address);
            if (angular.element('#primary_address:checked').length === 1) {
                _.each(this.contact.addresses, (address) => {
                    address.primary_mailing_address = address.id === this.address.id;
                });
            }
            return this.contacts.saveAddress(this.contact.id, this.address).then(() => {
                this.$scope.$hide();
            });
        } else {
            return this.contacts.addAddress(this.contact.id, this.address).then((data) => {
                this.contact.addresses.push(data);
                this.$scope.$hide();
            });
        }
    }
    reqUpdateEmailBodyRequest() {
        if (this.address.remote_id) {
            const donorAccount = this.contact.donor_accounts.filter(da => da.id === this.address.source_donor_account_id);

            const donorName = donorAccount.length > 0 ? donorAccount.name + ' (donor #' + donorAccount.account_number + ')' : this.contact.name;
            return `Dear Donation Services,\n\n One of my donors, ${donorName} has a new current address.\n\n
                Please update their address to:\n\n REPLACE WITH NEW STREET\n REPLACE WITH NEW CITY, STATE, ZIP\n\n
                Thanks!\n\n`;
        }

        return '';
    }
    refreshMap() {
        _.each(this.maps, (map) => {
            if (angular.isDefined(this.address.gmap)) {
                if (angular.isDefined(this.marker)) {
                    this.marker.setMap(null);
                }
                this.marker = new this.$window.google.maps.Marker({
                    map: map,
                    position: this.address.gmap.geometry.location
                });
                this.$window.google.maps.event.trigger(map, 'resize');
                map.setCenter(this.address.gmap.geometry.location);
            }
        });
    }
    delete() {
        this.address._destroy = 1;
        return this.save();
    }
}

export default angular.module('mpdx.contacts.show.address.modal.controller', [])
    .controller('addressModalController', AddressModalController).name;
