import component from './prayerLetters.component';

describe('preferences.integrations.prayerLetters.component', () => {
    let $ctrl, prayerLetters, rootScope, scope, componentController, gettextCatalog, modal, api, q;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _prayerLetters_, _gettextCatalog_, _modal_, _api_, $q) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            prayerLetters = _prayerLetters_;
            api = _api_;
            modal = _modal_;
            gettextCatalog = _gettextCatalog_;
            q = $q;
            componentController = $componentController;
            loadController();
        });
        spyOn(gettextCatalog, 'getString').and.callThrough();
    });

    function loadController() {
        $ctrl = componentController('prayerLettersIntegrationsPreferences', { $scope: scope }, {});
    }
    describe('$onInit', () => {
        beforeEach(() => {
            spyOn(prayerLetters, 'load').and.callFake(() => {});
            $ctrl.$onInit();
            expect(prayerLetters.load).toHaveBeenCalledWith(true);
        });
    });
    describe('sync', () => {
        it('should set saving flag', () => {
            spyOn(api, 'get').and.callFake(() => q.resolve());
            $ctrl.sync();
            expect($ctrl.saving).toBeTruthy();
        });
        it('should sync', () => {
            spyOn(api, 'get').and.callFake(() => q.resolve());
            const successMessage = 'MPDX is now syncing your newsletter recipients with Prayer Letters';
            const errorMessage = 'MPDX couldn\'t save your configuration changes for Prayer Letters';
            api.account_list_id = 123;
            $ctrl.sync();
            expect(api.get).toHaveBeenCalledWith(
                'account_lists/123/prayer_letters_account/sync',
                undefined, successMessage, errorMessage
            );
            expect(gettextCatalog.getString).toHaveBeenCalledWith(successMessage);
            expect(gettextCatalog.getString).toHaveBeenCalledWith(errorMessage);
        });
        it('should unset saving flag', (done) => {
            spyOn(api, 'get').and.callFake(() => q.resolve());
            $ctrl.sync().then(() => {
                expect($ctrl.saving).toBeFalsy();
                done();
            });
            scope.$digest();
        });
        it('should handle rejection', (done) => {
            spyOn(api, 'get').and.callFake(() => q.reject({ errors: ['a'] }));
            $ctrl.sync().catch(() => {
                expect($ctrl.saving).toBeFalsy();
                done();
            });
            scope.$digest();
        });
    });
    describe('disconnect', () => {
        beforeEach(() => {
            spyOn(modal, 'confirm').and.callFake(() => q.resolve());
        });
        it('should disconnect', (done) => {
            spyOn(prayerLetters, 'disconnect').and.callFake(() => q.resolve());
            const errorMessage = 'MPDX couldn\'t save your configuration changes for Prayer Letters';
            const successMessage = 'MPDX removed your integration with Prayer Letters';
            $ctrl.disconnect().then(() => {
                expect(prayerLetters.disconnect).toHaveBeenCalledWith(successMessage, errorMessage);
                expect(gettextCatalog.getString).toHaveBeenCalledWith(successMessage);
                expect(gettextCatalog.getString).toHaveBeenCalledWith(errorMessage);
                done();
            });
            scope.$digest();
        });
        it('should unset saving flag', (done) => {
            spyOn(prayerLetters, 'disconnect').and.callFake(() => q.resolve());
            $ctrl.disconnect().then(() => {
                expect($ctrl.saving).toBeFalsy();
                done();
            });
            scope.$digest();
        });
        it('should handle rejection', (done) => {
            spyOn(prayerLetters, 'disconnect').and.callFake(() => q.reject({}));
            $ctrl.disconnect().catch(() => {
                expect($ctrl.saving).toBeFalsy();
                done();
            });
            scope.$digest();
        });
    });
});