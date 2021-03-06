import component from './email.component';

const fakeBlockUI = {
    reset: () => {},
    start: () => {}
};

describe('tools.fix.emailAddresses.component', () => {
    let $ctrl, rootScope, scope, gettextCatalog, blockUI, modal, fixEmailAddresses, q;

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _gettextCatalog_, _blockUI_, _modal_, _fixEmailAddresses_, $q) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            gettextCatalog = _gettextCatalog_;
            blockUI = _blockUI_;
            modal = _modal_;
            fixEmailAddresses = _fixEmailAddresses_;
            q = $q;
            spyOn(blockUI.instances, 'get').and.callFake(() => fakeBlockUI);
            $ctrl = $componentController('fixEmailAddresses', { $scope: scope });
        });
        spyOn($ctrl.blockUI, 'start').and.callThrough();
        spyOn($ctrl.blockUI, 'reset').and.callThrough();
    });

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
            spyOn($ctrl, 'load').and.callFake(() => q.resolve());
            rootScope.$emit('accountListUpdated');
            expect($ctrl.load).toHaveBeenCalled();
        });
    });

    describe('save', () => {
        beforeEach(() => {
            spyOn(modal, 'confirm').and.callFake(() => q.resolve());
            spyOn(gettextCatalog, 'getString').and.callThrough();
        });

        it('should call a translated confirm message', () => {
            $ctrl.save();
            expect(gettextCatalog.getString).toHaveBeenCalledWith(
                `You are updating all contacts visible on this page, setting the first {{source}} email address as the
            primary email address. If no such email address exists the contact will not be updated.
            Are you sure you want to do this?`,
                { source: 'MPDX' }
            );
        });

        it('should open a confirm modal', () => {
            $ctrl.save();
            expect(modal.confirm).toHaveBeenCalledWith(
                `You are updating all contacts visible on this page, setting the first MPDX email address as the
            primary email address. If no such email address exists the contact will not be updated.
            Are you sure you want to do this?`);
        });

        it('should return a promise', () => {
            expect($ctrl.save()).toEqual(jasmine.any(q));
        });

        describe('on confirmation', () => {
            beforeEach(() => {
                spyOn(fixEmailAddresses, 'bulkSave').and.callFake(() => q.resolve());
            });

            it('should call bulk save with source', (done) => {
                $ctrl.save().then(() => {
                    expect(fixEmailAddresses.bulkSave).toHaveBeenCalledWith('MPDX');
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

    describe('load', () => {
        beforeEach(() => {
            spyOn(fixEmailAddresses, 'load').and.callFake(() => q.resolve());
        });

        it('should return a promise', () => {
            expect($ctrl.load()).toEqual(jasmine.any(q));
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
