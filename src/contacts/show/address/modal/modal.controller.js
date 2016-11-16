class AddressModalController {
    contact;
    contactsService;
    serverConstants;

    constructor(
        $scope, $timeout, $window, contactsService, serverConstants, contact, address
    ) {
        this.$scope = $scope;
        this.$timeout = $timeout;
        this.$window = $window;
        this.address = address;
        this.contact = contact;
        this.contactsService = contactsService;
        this.serverConstants = serverConstants;

        this.constants = serverConstants.data;

        this.maps = [];

        let $ctrl = this;
        this.updateAddress = function() { //workaround for weird bindings in google places
            let updatedAddress = this.getPlace();
            $ctrl.address = {id: $ctrl.address.id, street: '', location: $ctrl.address.location || 'Home'};
            if (_.has(updatedAddress, 'geometry.location')) {
                $ctrl.address.map = '[' + updatedAddress.geometry.location.lat() + ',' + updatedAddress.geometry.location.lng() + ']';
            }
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

        this.activate();
    }
    activate() {
        this.address.map = this.address.geo; //set initial map value

        this.serverConstants.fetchConstants(['assignable_locations']);

        if (angular.isDefined(this.address)) {
            this.modalTitle = 'Edit Address';
        } else {
            this.modalTitle = 'Add Address';
            this.address = { street: '', location: 'Home' };
        }

        this.$timeout(this.refreshMap.bind(this), 500);
    }
    save(isValid) {
        if (isValid) {
            if (angular.isDefined(this.address.id)) {
                var addressIndex = _.findIndex(this.contact.addresses, addressToFilter => addressToFilter.id === this.address.id);
                this.contact.addresses[addressIndex] = angular.copy(this.address);
                if (angular.element('#primary_address:checked').length === 1) {
                    _.each(this.contact.addresses, (address) => {
                        address.primary_mailing_address = address.id === this.address.id;
                    });
                }
            } else {
                this.contact.addresses.push(this.address);
            }
            this.contactsService.save(this.contact).then(() => {
                this.$scope.$hide();
            });
        }
    }
    reqUpdateEmailBodyRequest() {
        if (this.address.remote_id) {
            var donorAccount = this.contact.donor_accounts.filter(da => da.id === this.address.source_donor_account_id);

            var donorName = donorAccount.length > 0 ? donorAccount.name + ' (donor #' + donorAccount.account_number + ')' : this.contact.name;
            return `Dear Donation Services,\n\n One of my donors, ${donorName} has a new current address.\n\n
                Please update their address to:\n\n REPLACE WITH NEW STREET\n REPLACE WITH NEW CITY, STATE, ZIP\n\n
                Thanks!\n\n`;
        }

        return '';
    }
    refreshMap() {
        _.each(this.maps, (index) => {
            this.$window.google.maps.event.trigger(index, 'resize');
        });
    }
    remove() {
        this.address._destroy = 1;
        this.save(true);
    }
}

export default angular.module('mpdx.contacts.show.address.modal.controller', [])
    .controller('addressModalController', AddressModalController).name;