import component from './addresses.component';

const fakeBlockUI = {
    reset: () => {},
    start: () => {}
};

describe('tools.fix.addresses.component', () => {
    let $ctrl, rootScope, scope, componentController, gettextCatalog, blockUI, modal, fixAddresses;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _gettextCatalog_, _blockUI_, _modal_, _fixAddresses_) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            gettextCatalog = _gettextCatalog_;
            blockUI = _blockUI_;
            modal = _modal_;
            fixAddresses = _fixAddresses_;
            componentController = $componentController;
            loadController();
        });
    });

    function loadController() {
        spyOn(blockUI.instances, 'get').and.callFake(() => fakeBlockUI);
        $ctrl = componentController('fixAddresses', { $scope: scope });
        spyOn($ctrl.blockUI, 'start').and.callThrough();
        spyOn($ctrl.blockUI, 'reset').and.callThrough();
    }

    describe('constructor', () => {
        it('should set default values', () => {
            expect($ctrl.source).toEqual('MPDX');
        });

        it('should get instance of blockUI', () => {
            expect(blockUI.instances.get).toHaveBeenCalledWith('fix-addresses');
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
            spyOn(gettextCatalog, 'getString').and.callThrough();
        });

        it('should call a translated confirm message', () => {
            $ctrl.save();
            expect(gettextCatalog.getString).toHaveBeenCalledWith(`You are updating all contacts visible on this page, setting the first {{source}} address as the primary address.
            If no such address exists the contact will not be updated. Are you sure you want to do this?`,
                { source: 'MPDX' });
        });

        it('should open a confirm modal', () => {
            $ctrl.save();
            expect(modal.confirm).toHaveBeenCalledWith(`You are updating all contacts visible on this page, setting the first MPDX address as the primary address.
            If no such address exists the contact will not be updated. Are you sure you want to do this?`);
        });

        it('should return a promise', () => {
            expect($ctrl.save()).toEqual(jasmine.any(Promise));
        });

        describe('on confirmation', () => {
            beforeEach(() => {
                spyOn(fixAddresses, 'bulkSave').and.callFake(() => Promise.resolve());
            });

            it('should call bulk save with source', (done) => {
                $ctrl.save().then(() => {
                    expect(fixAddresses.bulkSave).toHaveBeenCalledWith('MPDX');
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
            spyOn(fixAddresses, 'load').and.callFake(() => Promise.resolve());
        });

        it('should return a promise', () => {
            expect($ctrl.load()).toEqual(jasmine.any(Promise));
        });

        describe('page == 1', () => {
            it('should call fixAddresses.load with page', () => {
                $ctrl.load(1);
                expect(fixAddresses.load).toHaveBeenCalledWith(true, 1);
            });
        });

        describe('page not set', () => {
            it('should call fixAddresses.load with null', () => {
                $ctrl.load();
                expect(fixAddresses.load).toHaveBeenCalledWith(true, null);
            });
        });
    });
});
