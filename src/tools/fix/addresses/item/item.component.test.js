import component from './item.component';

const fakeBlockUI = {
    reset: () => {},
    start: () => {}
};

describe('tools.fix.addresses.item.component', () => {
    let $ctrl, rootScope, scope, componentController, blockUI, fixAddresses, contact;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _blockUI_, _fixAddresses_) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            blockUI = _blockUI_;
            fixAddresses = _fixAddresses_;
            componentController = $componentController;
            contact = { id: 'contact_id' };
            loadController();
        });
    });

    function loadController() {
        spyOn(blockUI.instances, 'get').and.callFake(() => fakeBlockUI);
        $ctrl = componentController('fixAddressesItem', { $scope: scope }, { contact: contact });
        spyOn($ctrl.blockUI, 'start').and.callThrough();
        spyOn($ctrl.blockUI, 'reset').and.callThrough();
    }

    describe('$onInit', () => {
        it('should get instance of blockUI', () => {
            $ctrl.$onInit();
            expect(blockUI.instances.get).toHaveBeenCalledWith('fix-addresses-item-contact_id');
            expect($ctrl.blockUI).toEqual(fakeBlockUI);
        });
    });

    describe('hasPrimary', () => {
        beforeEach(() => {
            spyOn(fixAddresses, 'hasPrimary').and.returnValue(true);
        });

        it('should call fixEmailAddresses', () => {
            $ctrl.hasPrimary();
            expect(fixAddresses.hasPrimary).toHaveBeenCalledWith(contact);
        });

        it('should return boolean', () => {
            expect($ctrl.hasPrimary()).toEqual(jasmine.any(Boolean));
        });
    });

    describe('save', () => {
        beforeEach(() => {
            spyOn(fixAddresses, 'save').and.callFake(() => Promise.resolve());
        });

        it('should call save', (done) => {
            $ctrl.save().then(() => {
                expect(fixAddresses.save).toHaveBeenCalledWith(contact);
                done();
            });
        });

        it('should have toggled blockUI', (done) => {
            $ctrl.save().then(() => {
                expect($ctrl.blockUI.start).toHaveBeenCalled();
                expect($ctrl.blockUI.reset).toHaveBeenCalled();
                done();
            });
        });
    });
});
