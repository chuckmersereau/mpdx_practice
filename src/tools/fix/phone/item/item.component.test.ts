import component from './item.component';

const fakeBlockUI = {
    reset: () => {},
    start: () => {}
};

describe('tools.fix.phoneNumbers.item.component', () => {
    let $ctrl, rootScope, scope, blockUI, fixPhoneNumbers, person, q;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _blockUI_, _fixPhoneNumbers_, $q) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            blockUI = _blockUI_;
            fixPhoneNumbers = _fixPhoneNumbers_;
            q = $q;
            person = { id: 'person_id' };
            spyOn(blockUI.instances, 'get').and.callFake(() => fakeBlockUI);
            $ctrl = $componentController('fixPhoneNumbersItem', { $scope: scope }, { person: person });
        });
        spyOn($ctrl.blockUI, 'start').and.callThrough();
        spyOn($ctrl.blockUI, 'reset').and.callThrough();
    });

    describe('$onInit', () => {
        it('should get instance of blockUI', () => {
            $ctrl.$onInit();
            expect(blockUI.instances.get).toHaveBeenCalledWith('fix-phone-numbers-item-person_id');
            expect($ctrl.blockUI).toEqual(fakeBlockUI);
        });
    });

    describe('hasMultiplePrimaries', () => {
        beforeEach(() => {
            spyOn(fixPhoneNumbers, 'hasPrimary').and.returnValue(true);
        });

        it('should call fixPhoneNumbers', () => {
            $ctrl.hasPrimary();
            expect(fixPhoneNumbers.hasPrimary).toHaveBeenCalledWith(person);
        });

        it('should return boolean', () => {
            expect($ctrl.hasPrimary()).toEqual(jasmine.any(Boolean));
        });
    });

    describe('save', () => {
        beforeEach(() => {
            spyOn(fixPhoneNumbers, 'save').and.callFake(() => q.resolve());
        });

        it('should call save', (done) => {
            $ctrl.save().then(() => {
                expect(fixPhoneNumbers.save).toHaveBeenCalledWith(person);
                done();
            });
            scope.$digest();
        });

        it('should have toggled blockUI', (done) => {
            $ctrl.save().then(() => {
                expect($ctrl.blockUI.start).toHaveBeenCalled();
                expect($ctrl.blockUI.reset).toHaveBeenCalled();
                done();
            });
            scope.$digest();
        });
    });
});
