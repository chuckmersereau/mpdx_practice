import component from './emailAddresses.component';

const fakeBlockUI = {
    reset: () => {},
    start: () => {}
};

describe('tools.fix.emailAddresses.component', () => {
    let $ctrl, rootScope, scope, componentController, gettextCatalog, blockUI, modal, fixEmailAddresses;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _gettextCatalog_, _blockUI_, _modal_, _fixEmailAddresses_) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            gettextCatalog = _gettextCatalog_;
            blockUI = _blockUI_;
            modal = _modal_;
            fixEmailAddresses = _fixEmailAddresses_;
            componentController = $componentController;
            loadController();
        });
    });

    function loadController() {
        spyOn(blockUI.instances, 'get').and.callFake(() => fakeBlockUI);
        $ctrl = componentController('fixEmailAddresses', { $scope: scope });
        spyOn($ctrl.blockUI, 'start').and.callThrough();
        spyOn($ctrl.blockUI, 'reset').and.callThrough();
    }

    describe('constructor', () => {
        it('should set default values', () => {
            expect($ctrl.source).toEqual('MPDX');
        });

        it('should get instance of blockUI', () => {
            expect(blockUI.instances.get).toHaveBeenCalledWith('fix-email-addresses');
            expect($ctrl.blockUI).toEqual(fakeBlockUI);
        });
    });
    describe('events', () => {
        it('should fire load on accountListUpdated', () => {
            spyOn($ctrl, 'load').and.callFake(() => Promise.resolve());
            rootScope.$emit('accountListUpdated');
            expect($ctrl.load).toHaveBeenCalled();
        });
    });
    describe('save', () => {
        beforeEach(() => {
            spyOn(modal, 'confirm').and.callFake(() => Promise.resolve());
            spyOn(gettextCatalog, 'getString').and.callFake(() => {});
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
                spyOn(fixEmailAddresses, 'bulkSave').and.callFake(() => Promise.resolve());
            });

            it('should call bulk save with source', (done) => {
                $ctrl.save().then(() => {
                    expect(fixEmailAddresses.bulkSave).toHaveBeenCalledWith('MPDX');
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
            spyOn(fixEmailAddresses, 'load').and.callFake(() => Promise.resolve());
        });

        it('should return a promise', () => {
            expect($ctrl.load()).toEqual(jasmine.any(Promise));
        });

        describe('page == 1', () => {
            it('should call fixEmailAddresses.load with page', () => {
                $ctrl.load(1);
                expect(fixEmailAddresses.load).toHaveBeenCalledWith(true, 1);
            });
        });

        describe('page not set', () => {
            it('should call fixEmailAddresses.load with null', () => {
                $ctrl.load();
                expect(fixEmailAddresses.load).toHaveBeenCalledWith(true, null);
            });
        });
    });
});
