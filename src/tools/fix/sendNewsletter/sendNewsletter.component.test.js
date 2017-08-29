import newsletter from './sendNewsletter.component';

describe('tools.fix.sendNewsletter.component', () => {
    let $ctrl, rootScope, scope, componentController, gettextCatalog, modal, fixSendNewsletter;
    beforeEach(() => {
        angular.mock.module(newsletter);
        inject(($componentController, $rootScope, _gettextCatalog_, _modal_, _fixSendNewsletter_) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            gettextCatalog = _gettextCatalog_;
            modal = _modal_;
            fixSendNewsletter = _fixSendNewsletter_;
            componentController = $componentController;
            loadController();
        });
    });

    function loadController() {
        $ctrl = componentController('fixSendNewsletter', { $scope: scope });
    }

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
                spyOn(fixSendNewsletter, 'bulkSave').and.callFake(() => Promise.resolve());
            });

            it('should call bulk save', (done) => {
                $ctrl.save().then(() => {
                    expect(fixSendNewsletter.bulkSave).toHaveBeenCalled();
                    done();
                });
            });
        });
    });

    describe('load', () => {
        beforeEach(() => {
            spyOn(fixSendNewsletter, 'load').and.callFake(() => Promise.resolve());
        });

        it('should return a promise', () => {
            expect($ctrl.load()).toEqual(jasmine.any(Promise));
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
