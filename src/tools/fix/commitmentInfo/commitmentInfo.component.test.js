import commitmentInfo from './commitmentInfo.component';

const fakeBlockUI = {
    reset: () => {},
    start: () => {}
};

describe('tools.fix.commitmentInfo.component', () => {
    let $ctrl, rootScope, scope, componentController, gettextCatalog, blockUI, modal, fixCommitmentInfo;
    beforeEach(() => {
        angular.mock.module(commitmentInfo);
        inject(($componentController, $rootScope, _gettextCatalog_, _blockUI_, _modal_, _fixCommitmentInfo_) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            gettextCatalog = _gettextCatalog_;
            blockUI = _blockUI_;
            modal = _modal_;
            fixCommitmentInfo = _fixCommitmentInfo_;
            componentController = $componentController;
            loadController();
        });
    });

    function loadController() {
        spyOn(blockUI.instances, 'get').and.callFake(() => fakeBlockUI);
        $ctrl = componentController('fixCommitmentInfo', { $scope: scope });
        spyOn($ctrl.blockUI, 'start').and.callThrough();
        spyOn($ctrl.blockUI, 'reset').and.callThrough();
    }

    describe('constructor', () => {
        it('should get instance of blockUI', () => {
            expect(blockUI.instances.get).toHaveBeenCalledWith('fix-commitment-info');
            expect($ctrl.blockUI).toEqual(fakeBlockUI);
        });
    });
    describe('events', () => {
        it('should fire load on accountListUpdated', () => {
            spyOn($ctrl, 'load').and.callFake(() => Promise.resolve());
            $ctrl.$onInit();
            rootScope.$emit('accountListUpdated');
            rootScope.$digest();
            expect($ctrl.load).toHaveBeenCalled();
            $ctrl.$onDestroy();
        });
        it('should remove contact on contactHidden', () => {
            fixCommitmentInfo.data = [{ id: 2 }];
            $ctrl.$onInit();
            rootScope.$emit('contactHidden', 2);
            expect(fixCommitmentInfo.data).toEqual([]);
            $ctrl.$onDestroy();
        });
    });
    describe('$onDestroy', () => {
        it('should kill the watchers', () => {
            $ctrl.$onInit();
            spyOn($ctrl, 'watcher').and.callFake(() => {});
            spyOn($ctrl, 'watcher2').and.callFake(() => {});
            $ctrl.$onDestroy();
            expect($ctrl.watcher).toHaveBeenCalledWith();
            expect($ctrl.watcher2).toHaveBeenCalledWith();
        });
    });
    describe('save', () => {
        beforeEach(() => {
            spyOn(modal, 'confirm').and.callFake(() => Promise.resolve());
            spyOn(gettextCatalog, 'getString').and.callThrough();
        });

        it('should call a translated confirm message', () => {
            $ctrl.save();
            expect(gettextCatalog.getString).toHaveBeenCalled();
        });

        it('should open a confirm modal', () => {
            $ctrl.save();
            expect(modal.confirm).toHaveBeenCalled();
        });

        it('should return a promise', () => {
            expect($ctrl.save()).toEqual(jasmine.any(Promise));
        });

        describe('on confirmation', () => {
            beforeEach(() => {
                spyOn(fixCommitmentInfo, 'bulkSave').and.callFake(() => Promise.resolve());
            });

            it('should call bulk save', (done) => {
                $ctrl.save().then(() => {
                    expect(fixCommitmentInfo.bulkSave).toHaveBeenCalled();
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

    describe('load', () => {
        beforeEach(() => {
            spyOn(fixCommitmentInfo, 'load').and.callFake(() => Promise.resolve());
        });

        it('should return a promise', () => {
            expect($ctrl.load()).toEqual(jasmine.any(Promise));
        });

        describe('page == 1', () => {
            it('should call fixCommitmentInfo.load with page', () => {
                $ctrl.load(1);
                expect(fixCommitmentInfo.load).toHaveBeenCalledWith(true, 1);
            });
        });

        describe('page not set', () => {
            it('should call fixCommitmentInfo.load with null', () => {
                $ctrl.load();
                expect(fixCommitmentInfo.load).toHaveBeenCalledWith(true, null);
            });
        });
    });
});
