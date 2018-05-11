import component from './field.component';

describe('tools.fix.phoneNumbers.item.field.component', () => {
    let $ctrl, rootScope, scope, fixPhoneNumbers, person, phoneNumber, q;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _fixPhoneNumbers_, $q) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            fixPhoneNumbers = _fixPhoneNumbers_;
            q = $q;
            person = { id: 'person_id', phone_numbers: [] };
            phoneNumber = { id: 'phone_number_id', new: true };
            $ctrl = $componentController('fixPhoneNumbersItemField',
                { $scope: scope },
                { person: person, phoneNumber: phoneNumber });
        });
    });

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
            spyOn(fixPhoneNumbers, 'savePhoneNumber').and.callFake(() => q.resolve());
        });

        it('should call fixPhoneNumbers', () => {
            $ctrl.save();
            expect(fixPhoneNumbers.savePhoneNumber).toHaveBeenCalledWith(person, phoneNumber);
        });

        it('should return a promise', () => {
            expect($ctrl.save()).toEqual(jasmine.any(q));
        });

        describe('promise successful', () => {
            describe('saved phoneNumber is new', () => {
                it('should set phoneNumber as not new', (done) => {
                    $ctrl.save().then(() => {
                        expect($ctrl.person.phone_numbers[0].new).toBeFalsy();
                        done();
                    });
                    scope.$digest();
                });

                it('should add phoneNumber to person', (done) => {
                    $ctrl.save().then(() => {
                        expect($ctrl.person.phone_numbers).toEqual([{ id: 'phone_number_id', new: false }]);
                        done();
                    });
                    scope.$digest();
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
                    scope.$digest();
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
                    scope.$digest();
                });
            });
        });
    });

    describe('remove', () => {
        beforeEach(() => {
            spyOn(fixPhoneNumbers, 'removePhoneNumber').and.callFake(() => {});
        });

        it('should call fixPhoneNumbers', () => {
            $ctrl.remove();
            expect(fixPhoneNumbers.removePhoneNumber).toHaveBeenCalledWith(person, phoneNumber);
        });
    });

    describe('setPrimary', () => {
        beforeEach(() => {
            spyOn(fixPhoneNumbers, 'setPrimary').and.callFake(() => {});
        });

        it('should call fixPhoneNumbers', () => {
            $ctrl.setPrimary();
            expect(fixPhoneNumbers.setPrimary).toHaveBeenCalledWith(person, phoneNumber);
        });
    });
});
