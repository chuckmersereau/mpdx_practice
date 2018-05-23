import newsletter from './newsletter.component';

describe('tools.fix.sendNewsletter.component', () => {
    let $ctrl, rootScope, scope, gettextCatalog, modal, fixSendNewsletter, q;
    beforeEach(() => {
        angular.mock.module(newsletter);
        inject(($componentController, $rootScope, _gettextCatalog_, _modal_, _fixSendNewsletter_, $q) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            gettextCatalog = _gettextCatalog_;
            modal = _modal_;
            fixSendNewsletter = _fixSendNewsletter_;
            q = $q;
            $ctrl = $componentController('fixSendNewsletter', { $scope: scope });
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
                `You are updating all contacts visible on this page, setting it to the visible newsletter selection.
            Are you sure you want to do this?`);
        });

        it('should open a confirm modal', () => {
            $ctrl.save();
            expect(modal.confirm).toHaveBeenCalledWith(
                `You are updating all contacts visible on this page, setting it to the visible newsletter selection.
            Are you sure you want to do this?`);
        });

        it('should return a promise', () => {
            expect($ctrl.save()).toEqual(jasmine.any(q));
        });

        describe('on confirmation', () => {
            beforeEach(() => {
                spyOn(fixSendNewsletter, 'bulkSave').and.callFake(() => q.resolve());
            });

            it('should call bulk save', (done) => {
                $ctrl.save().then(() => {
                    expect(fixSendNewsletter.bulkSave).toHaveBeenCalled();
                    done();
                });
                scope.$digest();
            });
        });
    });

    describe('load', () => {
        beforeEach(() => {
            spyOn(fixSendNewsletter, 'load').and.callFake(() => q.resolve());
        });

        it('should return a promise', () => {
            expect($ctrl.load()).toEqual(jasmine.any(q));
        });

        describe('page == 1', () => {
            it('should call fixSendNewsletter.load with page', () => {
                $ctrl.load(1);
                expect(fixSendNewsletter.load).toHaveBeenCalledWith(true, 1);
            });
        });

        describe('page not set', () => {
            it('should call fixSendNewsletter.load with null', () => {
                $ctrl.load();
                expect(fixSendNewsletter.load).toHaveBeenCalledWith(true, null);
            });
        });
    });
});
