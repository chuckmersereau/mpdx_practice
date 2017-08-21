import component from './field.component';

describe('tools.fix.emailEmailAddresses.item.field.component', () => {
    let $ctrl, rootScope, scope, componentController, fixEmailAddresses, person, emailAddress;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _fixEmailAddresses_) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            fixEmailAddresses = _fixEmailAddresses_;
            componentController = $componentController;
            person = { id: 'person_id', email_addresses: [] };
            emailAddress = { id: 'email_address_id', new: true };
            loadController();
        });
    });

    function loadController() {
        $ctrl = componentController('fixEmailAddressesItemField',
            { $scope: scope },
            { person: person, emailAddress: emailAddress });
    }

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
            spyOn(fixEmailAddresses, 'saveEmailAddress').and.callFake(() => Promise.resolve());
        });

        it('should call fixEmailAddresses', () => {
            $ctrl.save();
            expect(fixEmailAddresses.saveEmailAddress).toHaveBeenCalledWith(person, emailAddress);
        });

        it('should return a promise', () => {
            expect($ctrl.save()).toEqual(jasmine.any(Promise));
        });

        describe('promise successful', () => {
            describe('saved emailAddress is new', () => {
                it('should set emailAddress as not new', (done) => {
                    $ctrl.save().then(() => {
                        expect($ctrl.person.email_addresses[0].new).toBeFalsy();
                        done();
                    });
                });

                it('should add emailAddress to person', (done) => {
                    $ctrl.save().then(() => {
                        expect($ctrl.person.email_addresses).toEqual([{ id: 'email_address_id', new: false }]);
                        done();
                    });
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
                });
            });
        });
    });

    describe('remove', () => {
        beforeEach(() => {
            spyOn(fixEmailAddresses, 'removeEmailAddress').and.returnValue();
        });

        it('should call fixEmailAddresses', () => {
            $ctrl.remove();
            expect(fixEmailAddresses.removeEmailAddress).toHaveBeenCalledWith(person, emailAddress);
        });
    });

    describe('setPrimary', () => {
        beforeEach(() => {
            spyOn(fixEmailAddresses, 'setPrimary').and.returnValue();
        });

        it('should call fixEmailAddresses', () => {
            $ctrl.setPrimary();
            expect(fixEmailAddresses.setPrimary).toHaveBeenCalledWith(person, emailAddress);
        });
    });
});
