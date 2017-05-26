import component from './field.component';

describe('tools.fix.addresses.item.field.component', () => {
    let $ctrl, rootScope, scope, componentController, fixAddresses, contact, address;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _fixAddresses_) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            fixAddresses = _fixAddresses_;
            componentController = $componentController;
            contact = { id: 'contact_id' };
            address = { id: 'address_id' };
            loadController();
        });
    });

    function loadController() {
        $ctrl = componentController('fixAddressesItemField', { $scope: scope }, { contact: contact, address: address });
    }

    describe('addressSummary', () => {
        describe('has no street', () => {
            it('should return blank', () => {
                expect($ctrl.addressSummary()).toEqual('');
            });
        });
        describe('has street', () => {
            beforeEach(() => {
                address.street = 'street_name';
            });

            it('should return street_name', () => {
                expect($ctrl.addressSummary()).toEqual('street_name');
            });

            describe('has city', () => {
                beforeEach(() => {
                    address.city = 'city_name';
                });

                it('should return street_name, city_name', () => {
                    expect($ctrl.addressSummary()).toEqual('street_name, city_name');
                });

                describe('has state', () => {
                    beforeEach(() => {
                        address.state = 'state_name';
                    });

                    it('should return street_name, city_name state_name', () => {
                        expect($ctrl.addressSummary()).toEqual('street_name, city_name state_name');
                    });

                    describe('has postal_code', () => {
                        beforeEach(() => {
                            address.postal_code = 'postal_code_name';
                        });

                        it('should return street_name, city_name state_name', () => {
                            expect($ctrl.addressSummary()).toEqual(
                                'street_name, city_name state_name. postal_code_name');
                        });
                    });
                });
            });
        });
    });

    describe('remove', () => {
        beforeEach(() => {
            spyOn(fixAddresses, 'removeAddress').and.returnValue();
        });

        it('should call fixAddresses', () => {
            $ctrl.remove();
            expect(fixAddresses.removeAddress).toHaveBeenCalledWith(contact, address);
        });
    });

    describe('setPrimary', () => {
        beforeEach(() => {
            spyOn(fixAddresses, 'setPrimary').and.returnValue();
        });

        it('should call fixAddresses', () => {
            $ctrl.setPrimary();
            expect(fixAddresses.setPrimary).toHaveBeenCalledWith(contact, address);
        });
    });
});
