import component from './field.component';

describe('tools.fix.phoneNumbers.item.field.component', () => {
    let $ctrl, rootScope, scope, componentController, fixPhoneNumbers, person, phoneNumber;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _fixPhoneNumbers_) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            fixPhoneNumbers = _fixPhoneNumbers_;
            componentController = $componentController;
            person = { id: 'person_id', phone_numbers: [] };
            phoneNumber = { id: 'phone_number_id', new: true };
            loadController();
        });
    });

    function loadController() {
        $ctrl = componentController('fixPhoneNumbersItemField',
            { $scope: scope },
            { person: person, phoneNumber: phoneNumber });
    }

    describe('$onInit', () => {
        describe('phone_number set', () => {
            it('should not set as new phoneNumber', () => {
                $ctrl.$onInit();
                expect($ctrl.phoneNumber).toEqual({ id: 'phone_number_id', new: true });
            });
        });

        describe('phone_number not set', () => {
            beforeEach(() => {
                $ctrl.phoneNumber = null;
            });

            it('should set as new phoneNumber', () => {
                $ctrl.$onInit();
                expect($ctrl.phoneNumber).toEqual({
                    id: jasmine.any(String),
                    source: 'MPDX',
                    new: true,
                    primary: false,
                    number: ''
                });
            });
        });
    });

    describe('save', () => {
        beforeEach(() => {
            spyOn(fixPhoneNumbers, 'savePhoneNumber').and.callFake(() => Promise.resolve());
        });

        it('should call fixPhoneNumbers', () => {
            $ctrl.save();
            expect(fixPhoneNumbers.savePhoneNumber).toHaveBeenCalledWith(person, phoneNumber);
        });

        it('should return a promise', () => {
            expect($ctrl.save()).toEqual(jasmine.any(Promise));
        });

        describe('promise successful', () => {
            describe('saved phoneNumber is new', () => {
                it('should set phoneNumber as not new', (done) => {
                    $ctrl.save().then(() => {
                        expect($ctrl.person.phone_numbers[0].new).toBeFalsy();
                        done();
                    });
                });

                it('should add phoneNumber to person', (done) => {
                    $ctrl.save().then(() => {
                        expect($ctrl.person.phone_numbers).toEqual([{ id: 'phone_number_id', new: false }]);
                        done();
                    });
                });

                it('should set phoneNumber as new', (done) => {
                    $ctrl.save().then(() => {
                        expect($ctrl.phoneNumber).toEqual({
                            id: jasmine.any(String),
                            source: 'MPDX',
                            new: true,
                            primary: false,
                            number: ''
                        });
                        done();
                    });
                });
            });

            describe('saved phoneNumber is not new', () => {
                beforeEach(() => {
                    $ctrl.phoneNumber.new = false;
                });

                it('should not change phoneNumber', (done) => {
                    $ctrl.save().then(() => {
                        expect($ctrl.phoneNumber).toEqual({ id: 'phone_number_id', new: false });
                        done();
                    });
                });
            });
        });
    });

    describe('remove', () => {
        beforeEach(() => {
            spyOn(fixPhoneNumbers, 'removePhoneNumber').and.returnValue();
        });

        it('should call fixPhoneNumbers', () => {
            $ctrl.remove();
            expect(fixPhoneNumbers.removePhoneNumber).toHaveBeenCalledWith(person, phoneNumber);
        });
    });

    describe('setPrimary', () => {
        beforeEach(() => {
            spyOn(fixPhoneNumbers, 'setPrimary').and.returnValue();
        });

        it('should call fixPhoneNumbers', () => {
            $ctrl.setPrimary();
            expect(fixPhoneNumbers.setPrimary).toHaveBeenCalledWith(person, phoneNumber);
        });
    });
});
