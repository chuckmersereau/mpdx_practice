import component from './item.component';

const fakeBlockUI = {
    reset: () => {},
    start: () => {}
};

describe('tools.fix.commitmentInfo.item.component', () => {
    let $ctrl, rootScope, scope, componentController, blockUI, fixCommitmentInfo, contact;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _blockUI_, _fixCommitmentInfo_) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            blockUI = _blockUI_;
            fixCommitmentInfo = _fixCommitmentInfo_;
            componentController = $componentController;
            contact = { id: 'contact_id' };
            loadController();
        });
    });

    function loadController() {
        spyOn(blockUI.instances, 'get').and.callFake(() => fakeBlockUI);
        $ctrl = componentController('fixCommitmentInfoItem', { $scope: scope }, { contact: contact });
        spyOn($ctrl.blockUI, 'start').and.callThrough();
        spyOn($ctrl.blockUI, 'reset').and.callThrough();
    }

    describe('$onInit', () => {
        it('should get instance of blockUI', () => {
            $ctrl.$onInit();
            expect(blockUI.instances.get).toHaveBeenCalledWith('fix-commitment-info-item-contact_id');
            expect($ctrl.blockUI).toEqual(fakeBlockUI);
        });
    });

    describe('save', () => {
        beforeEach(() => {
            spyOn(fixCommitmentInfo, 'save').and.callFake(() => Promise.resolve());
        });

        it('should call save', (done) => {
            $ctrl.save().then(() => {
                expect(fixCommitmentInfo.save).toHaveBeenCalledWith(contact);
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

    describe('reject', () => {
        beforeEach(() => {
            spyOn(fixCommitmentInfo, 'reject').and.callFake(() => Promise.resolve());
        });

        it('should call reject', (done) => {
            $ctrl.reject().then(() => {
                expect(fixCommitmentInfo.reject).toHaveBeenCalledWith(contact);
                done();
            });
        });

        it('should have toggled blockUI', (done) => {
            $ctrl.reject().then(() => {
                expect($ctrl.blockUI.start).toHaveBeenCalled();
                expect($ctrl.blockUI.reset).toHaveBeenCalled();
                done();
            });
        });
    });
});
