import component from './field.component';

describe('tools.fix.emailEmailAddresses.item.field.component', () => {
    let $ctrl, rootScope, scope, fixEmailAddresses, person, emailAddress, q;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _fixEmailAddresses_, $q) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            fixEmailAddresses = _fixEmailAddresses_;
            q = $q;
            person = { id: 'person_id', email_addresses: [] };
            emailAddress = { id: 'email_address_id', new: true };
            $ctrl = $componentController('fixEmailAddressesItemField',
                { $scope: scope },
                { person: person, emailAddress: emailAddress });
        });
    });

    describe('$onInit', () => {
        describe('email_address set', () => {
            it('should not set as new emailAddress', () => {
                $ctrl.$onInit();
                expect($ctrl.emailAddress).toEqual({ id: 'email_address_id', new: true });
            });
        });

        describe('email_address not set', () => {
            beforeEach(() => {
                $ctrl.emailAddress = null;
            });

            it('should set as new emailAddress', () => {
                $ctrl.$onInit();
                expect($ctrl.emailAddress).toEqual({
                    id: jasmine.any(String),
                    source: 'MPDX',
                    new: true,
                    primary: false,
                    email: ''
                });
            });
        });
    });

    describe('save', () => {
        beforeEach(() => {
            spyOn(fixEmailAddresses, 'saveEmailAddress').and.callFake(() => q.resolve());
        });

        it('should call fixEmailAddresses', () => {
            $ctrl.save();
            expect(fixEmailAddresses.saveEmailAddress).toHaveBeenCalledWith(person, emailAddress);
        });

        it('should return a promise', () => {
            expect($ctrl.save()).toEqual(jasmine.any(q));
        });

        describe('promise successful', () => {
            describe('saved emailAddress is new', () => {
                it('should set emailAddress as not new', (done) => {
                    $ctrl.save().then(() => {
                        expect($ctrl.person.email_addresses[0].new).toBeFalsy();
                        done();
                    });
                    scope.$digest();
                });

                it('should add emailAddress to person', (done) => {
                    $ctrl.save().then(() => {
                        expect($ctrl.person.email_addresses).toEqual([{ id: 'email_address_id', new: false }]);
                        done();
                    });
                    scope.$digest();
                });

                it('should set emailAddress as new', (done) => {
                    $ctrl.save().then(() => {
                        expect($ctrl.emailAddress).toEqual({
                            id: jasmine.any(String),
                            source: 'MPDX',
                            new: true,
                            primary: false,
                            email: ''
                        });
                        done();
                    });
                    scope.$digest();
                });
            });

            describe('saved emailAddress is not new', () => {
                beforeEach(() => {
                    $ctrl.emailAddress.new = false;
                });

                it('should not change emailAddress', (done) => {
                    $ctrl.save().then(() => {
                        expect($ctrl.emailAddress).toEqual({ id: 'email_address_id', new: false });
                        done();
                    });
                    scope.$digest();
                });
            });
        });
    });

    describe('remove', () => {
        beforeEach(() => {
            spyOn(fixEmailAddresses, 'removeEmailAddress').and.callFake(() => {});
        });

        it('should call fixEmailAddresses', () => {
            $ctrl.remove();
            expect(fixEmailAddresses.removeEmailAddress).toHaveBeenCalledWith(person, emailAddress);
        });
    });

    describe('setPrimary', () => {
        beforeEach(() => {
            spyOn(fixEmailAddresses, 'setPrimary').and.callFake(() => {});
        });

        it('should call fixEmailAddresses', () => {
            $ctrl.setPrimary();
            expect(fixEmailAddresses.setPrimary).toHaveBeenCalledWith(person, emailAddress);
        });
    });
});
