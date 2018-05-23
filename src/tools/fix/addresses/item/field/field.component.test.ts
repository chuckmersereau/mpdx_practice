import component from './field.component';

describe('tools.fix.addresses.item.field.component', () => {
    let $ctrl, rootScope, scope, contact, address, contacts, q;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _contacts_, $q) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            contacts = _contacts_;
            q = $q;
            contact = { id: 'contact_id' };
            address = { id: 'address_id' };
            $ctrl = $componentController('fixAddressesItemField',
                { $scope: scope },
                { contact: contact, address: address });
        });
    });

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

    describe('removeAddress', () => {
        const contact = {
            id: 'contact_id',
            addresses: [
                {
                    id: 'address_0',
                    primary_mailing_address: true
                }, {
                    id: 'address_1',
                    primary_mailing_address: true
                }, {
                    id: 'address_2',
                    primary_mailing_address: false
                }]
        };

        const address = { id: 'address_1' };

        beforeEach(() => {
            spyOn(contacts, 'deleteAddress').and.callFake(() => q.resolve({}));
        });

        it('should call the contacts service', () => {
            $ctrl.contact = contact;
            $ctrl.address = address;
            $ctrl.remove();
            expect(contacts.deleteAddress).toHaveBeenCalledWith(
                'contact_id', 'address_1'
            );
        });

        it('should remove address from contact object', (done) => {
            $ctrl.contact = contact;
            $ctrl.address = address;
            $ctrl.remove().then(() => {
                expect($ctrl.contact).toEqual({
                    id: 'contact_id',
                    addresses: [
                        {
                            id: 'address_0',
                            primary_mailing_address: true
                        }, {
                            id: 'address_2',
                            primary_mailing_address: false
                        }
                    ]
                });
                done();
            });
            scope.$digest();
        });
    });

    describe('setPrimary', () => {
        it('should set the primary_mailing_address address as primary_mailing_address in the contact object', () => {
            let contact = {
                addresses: [{
                    id: 'address_0',
                    primary_mailing_address: true
                }, {
                    id: 'address_1',
                    primary_mailing_address: true
                }, {
                    id: 'address_2',
                    primary_mailing_address: false
                }]
            };
            $ctrl.contact = contact;
            $ctrl.address = { id: 'address_2' };
            expect(contact.addresses[2].primary_mailing_address).toBeFalsy();
            $ctrl.setPrimary();
            expect(contact.addresses[2].primary_mailing_address).toBeTruthy();
        });
    });
});
