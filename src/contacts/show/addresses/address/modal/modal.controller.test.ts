import modal from './modal.controller';

const address = {
    street: '',
    location: 'Home',
    source: 'MPDX'
};

describe('contacts.show.address.modal.controller', () => {
    let $ctrl, controller, scope, NgMap, gettextCatalog, q, users;

    function loadController(contact = {}, address = {}) {
        $ctrl = controller('addressModalController as $ctrl', {
            $scope: scope,
            contact: contact,
            address: address
        });
    }

    beforeEach(() => {
        angular.mock.module(modal);
        inject(($controller, $rootScope, _NgMap_, _gettextCatalog_, $q, _users_) => {
            scope = $rootScope.$new();
            NgMap = _NgMap_;
            gettextCatalog = _gettextCatalog_;
            q = $q;
            users = _users_;
            controller = $controller;
            loadController();
        });
        spyOn(gettextCatalog, 'getString').and.callThrough();
    });

    describe('constructor', () => {
        beforeEach(() => {
            spyOn(NgMap, 'getMap').and.callFake(() => q.resolve());
            spyOn($ctrl, 'refreshMap').and.callFake(() => {});
        });

        it('should create a new address', () => {
            loadController(undefined, null);
            expect($ctrl.address).toEqual({ street: '', location: 'Home', source: 'MPDX' });
        });

        it('shouldn\'t be editable with a remote_id', () => {
            loadController({}, { remote_id: 123 });
            expect($ctrl.isEditable).toBeFalsy();
        });

        it('should be editable with source MPDX', () => {
            loadController({}, { source: 'MPDX' });
            expect($ctrl.isEditable).toBeTruthy();
        });

        it('should be editable with source manual', () => {
            loadController({}, { source: 'manual' });
            expect($ctrl.isEditable).toBeTruthy();
        });

        it('should be editable with source TntImport', () => {
            loadController({}, { source: 'TntImport' });
            expect($ctrl.isEditable).toBeTruthy();
        });

        it('should only use a copy of address', () => {
            loadController(undefined, address);
            expect($ctrl.address).toEqual(address);
            expect($ctrl.address === address).toBeFalsy();
        });
    });

    describe('updateAddress', () => {
        const retVal = {};
        beforeEach(() => {
            $ctrl.placesService = {
                getDetails: (data, cb) => {
                    cb(retVal);
                }
            };
            spyOn($ctrl.placesService, 'getDetails').and.callThrough();
            spyOn($ctrl, 'refreshMap').and.callFake(() => {});
            spyOn($ctrl, 'parsePlace').and.callFake(() => 'a');
            $ctrl.addressResults = [];
        });

        it('should get the place from api', () => {
            $ctrl.updateAddress({ place_id: 1 });
            expect($ctrl.placesService.getDetails).toHaveBeenCalledWith({ placeId: 1 }, jasmine.any(Function));
        });

        it('should assign the new place', () => {
            $ctrl.updateAddress({ place_id: 1 });
            expect($ctrl.place).toEqual(retVal);
        });

        it('should call parsePlace', () => {
            $ctrl.updateAddress({ place_id: 1 });
            expect($ctrl.address).toEqual('a');
        });

        it('should call refreshMap', () => {
            $ctrl.updateAddress({ place_id: 1 });
            expect($ctrl.refreshMap).toHaveBeenCalledWith();
        });

        it('should reset addressResults', () => {
            $ctrl.updateAddress({ place_id: 1 });
            expect($ctrl.addressResults).toBeUndefined();
        });
    });

    describe('parsePlace', () => {
        it('should mpdxify the google place object', () => {
            const place = {
                address_components: [
                    { types: ['subpremise'], long_name: 'W' },
                    { types: ['street_number'], long_name: '123' },
                    { types: ['route'], long_name: 'Street' },
                    { types: ['administrative_area_level_1'], short_name: 'FL' },
                    { types: ['administrative_area_level_2'], long_name: 'Lake Hart' },
                    { types: ['administrative_area_level_3'], long_name: 'Suburbia' },
                    { types: ['country'], long_name: 'United States' },
                    { types: ['postal_code'], long_name: '12345' },
                    { types: ['locality'], long_name: 'Orlando' }
                ]
            };
            expect($ctrl.parsePlace(place)).toEqual({
                street: 'W/123 Street',
                location: 'Home',
                source: 'MPDX',
                state: 'FL',
                region: 'Lake Hart',
                metro_area: 'Suburbia',
                country: 'United States',
                postal_code: '12345',
                city: 'Orlando'
            });
        });
    });

    describe('setTitle', () => {
        it('should translate the result', () => {
            $ctrl.setTitle();
            expect(gettextCatalog.getString).toHaveBeenCalled();
        });

        it('should return add', () => {
            expect($ctrl.setTitle()).toEqual('Add Address');
        });

        it('should return for edit', () => {
            expect($ctrl.setTitle({ id: 1, source: 'MPDX' }, {})).toEqual('Edit Address');
        });

        it('should return for read-only', () => {
            expect($ctrl.setTitle({ id: 1 })).toEqual('Address');
        });
    });

    describe('streetKeyUp', () => {
        let event;
        beforeEach(() => {
            $ctrl.addressResults = [];
            event = {
                currentTarget: {
                    value: '1'
                }
            };
            $ctrl.autocompleteService = {
                getPlacePredictions: (data) => data
            };
        });

        it('should handle escape', () => {
            event.key = 'Escape';
            $ctrl.streetKeyUp(event);
            expect($ctrl.addressResults).toEqual(null);
        });

        it('should handle enter', () => {
            event.key = 'Enter';
            $ctrl.streetKeyUp(event);
            expect($ctrl.addressResults).toEqual(null);
        });

        it('should call google api', () => {
            spyOn($ctrl.autocompleteService, 'getPlacePredictions').and.callThrough();
            event.key = '1';
            $ctrl.streetKeyUp(event);
            expect($ctrl.autocompleteService.getPlacePredictions)
                .toHaveBeenCalledWith({ input: '1', sessionToken: null }, jasmine.any(Function));
        });
        // callback test?
        xit('should set address results', (done) => {
            spyOn($ctrl.autocompleteService, 'getPlacePredictions').and.callFake(() => ['a']);
            event.key = '1';
            $ctrl.streetKeyUp(event, () => {
                expect($ctrl.addressResults).toEqual(['a']);
                done();
            });
            scope.$digest();
        });
    });

    describe('reqUpdateEmailBodyRequest', () => {
        beforeEach(() => {
            $ctrl.contact = { name: 'a' };
            users.current = { first_name: 'Tom' };
        });

        it('should return empty if not Siebel', () => {
            address.source = '';
            expect($ctrl.reqUpdateEmailBodyRequest()).toEqual('');
        });

        it('should handle a donor account', () => {
            $ctrl.address.source = 'Siebel';
            $ctrl.address.source_donor_account = { account_number: 123 };
            expect($ctrl.reqUpdateEmailBodyRequest()).toEqual('Dear Donation Services,%0D%0A%0D%0AOne of my donors, a (donor #123) has a new current address.%0D%0APlease update their address to:%0D%0AREPLACE WITH NEW STREET%0D%0AREPLACE WITH NEW CITY, STATE, ZIP%0D%0A%0D%0AThanks,%0D%0ATom');
        });

        it('should handle no donor account', () => {
            $ctrl.address.source = 'Siebel';
            $ctrl.address.source_donor_account = undefined;
            expect($ctrl.reqUpdateEmailBodyRequest()).toEqual('Dear Donation Services,%0D%0A%0D%0AOne of my donors, a has a new current address.%0D%0APlease update their address to:%0D%0AREPLACE WITH NEW STREET%0D%0AREPLACE WITH NEW CITY, STATE, ZIP%0D%0A%0D%0AThanks,%0D%0ATom');
        });

        it('should prior address', () => {
            $ctrl.address.source = 'Siebel';
            $ctrl.address.street = 'street';
            $ctrl.address.city = 'city';
            $ctrl.address.state = 'state';
            $ctrl.address.postal_code = 'postal_code';
            $ctrl.address.source_donor_account = undefined;
            expect($ctrl.reqUpdateEmailBodyRequest()).toEqual('Dear Donation Services,%0D%0A%0D%0AOne of my donors, a, previously located at:%0D%0Astreet%0D%0Acity, state postal_code,%0D%0Ahas a new current address.%0D%0APlease update their address to:%0D%0AREPLACE WITH NEW STREET%0D%0AREPLACE WITH NEW CITY, STATE, ZIP%0D%0A%0D%0AThanks,%0D%0ATom');
        });
    });
});