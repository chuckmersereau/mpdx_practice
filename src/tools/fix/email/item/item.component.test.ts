import component from './item.component';

const fakeBlockUI = {
    reset: () => {},
    start: () => {}
};

describe('tools.fix.emailAddresses.item.component', () => {
    let $ctrl, rootScope, scope, componentController, blockUI, fixEmailAddresses, person, q;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _blockUI_, _fixEmailAddresses_, $q) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            blockUI = _blockUI_;
            fixEmailAddresses = _fixEmailAddresses_;
            q = $q;
            componentController = $componentController;
            person = { id: 'person_id' };
            loadController();
        });
    });

    function loadController() {
        spyOn(blockUI.instances, 'get').and.callFake(() => fakeBlockUI);
        $ctrl = componentController('fixEmailAddressesItem', { $scope: scope }, { person: person });
        spyOn($ctrl.blockUI, 'start').and.callThrough();
        spyOn($ctrl.blockUI, 'reset').and.callThrough();
    }

    describe('hasMultiplePrimaries', () => {
        beforeEach(() => {
            spyOn(fixEmailAddresses, 'hasPrimary').and.returnValue(true);
        });

        it('should call fixEmailAddresses', () => {
            $ctrl.hasPrimary();
            expect(fixEmailAddresses.hasPrimary).toHaveBeenCalledWith(person);
        });

        it('should return boolean', () => {
            expect($ctrl.hasPrimary()).toEqual(jasmine.any(Boolean));
        });
    });

    describe('save', () => {
        beforeEach(() => {
            spyOn(fixEmailAddresses, 'save').and.callFake(() => q.resolve());
        });

        it('should call save', (done) => {
            $ctrl.save().then(() => {
                expect(fixEmailAddresses.save).toHaveBeenCalledWith(person);
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
