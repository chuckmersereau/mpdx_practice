import component from './phone.component';

const fakeBlockUI = {
    reset: () => {},
    start: () => {}
};

describe('tools.fix.phoneNumbers.component', () => {
    let $ctrl, rootScope, scope, gettextCatalog, blockUI, modal, fixPhoneNumbers, q;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _gettextCatalog_, _blockUI_, _modal_, _fixPhoneNumbers_, $q) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            gettextCatalog = _gettextCatalog_;
            blockUI = _blockUI_;
            modal = _modal_;
            fixPhoneNumbers = _fixPhoneNumbers_;
            q = $q;
            spyOn(blockUI.instances, 'get').and.callFake(() => fakeBlockUI);
            $ctrl = $componentController('fixPhoneNumbers', { $scope: scope });
        });
        spyOn($ctrl.blockUI, 'start').and.callThrough();
        spyOn($ctrl.blockUI, 'reset').and.callThrough();
    });

    describe('constructor', () => {
        it('should set default values', () => {
            expect($ctrl.source).toEqual('MPDX');
        });

        it('should get instance of blockUI', () => {
            expect(blockUI.instances.get).toHaveBeenCalledWith('fix-phone-numbers');
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
                `You are updating all contacts visible on this page, setting the first {{source}} phone number as the
            primary phone number. If no such phone number exists the contact will not be updated.
            Are you sure you want to do this?`,
                { source: 'MPDX' });
        });

        it('should open a confirm modal', () => {
            $ctrl.save();
            expect(modal.confirm).toHaveBeenCalledWith(
                `You are updating all contacts visible on this page, setting the first MPDX phone number as the
            primary phone number. If no such phone number exists the contact will not be updated.
            Are you sure you want to do this?`);
        });

        it('should return a promise', () => {
            expect($ctrl.save()).toEqual(jasmine.any(q));
        });

        describe('on confirmation', () => {
            beforeEach(() => {
                spyOn(fixPhoneNumbers, 'bulkSave').and.callFake(() => q.resolve());
            });

            it('should call bulk save with source', (done) => {
                $ctrl.save().then(() => {
                    expect(fixPhoneNumbers.bulkSave).toHaveBeenCalledWith('MPDX');
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
            spyOn(fixPhoneNumbers, 'load').and.callFake(() => q.resolve());
        });

        it('should return a promise', () => {
            expect($ctrl.load()).toEqual(jasmine.any(q));
        });

        describe('page == 1', () => {
            it('should call fixPhoneNumbers.load with page', () => {
                $ctrl.load(1);
                expect(fixPhoneNumbers.load).toHaveBeenCalledWith(true, 1);
            });
        });

        describe('page not set', () => {
            it('should call fixPhoneNumbers.load with null', () => {
                $ctrl.load();
                expect(fixPhoneNumbers.load).toHaveBeenCalledWith(true, null);
            });
        });
    });
});
