import component from './prayerLetters.component';

describe('preferences.integrations.prayerLetters.component', () => {
    let $ctrl, prayerLetters, rootScope, scope, componentController, alerts, gettextCatalog, modal;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _prayerLetters_, _gettextCatalog_, _modal_, _alerts_) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            prayerLetters = _prayerLetters_;
            alerts = _alerts_;
            modal = _modal_;
            gettextCatalog = _gettextCatalog_;
            componentController = $componentController;
            loadController();
        });
        spyOn(alerts, 'addAlert').and.callFake((data) => data);
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
            spyOn(prayerLetters, 'sync').and.callFake(() => Promise.resolve());
            $ctrl.sync();
            expect($ctrl.saving).toBeTruthy();
        });
        it('should sync', () => {
            spyOn(prayerLetters, 'sync').and.callFake(() => Promise.resolve());
            $ctrl.sync();
            expect(prayerLetters.sync).toHaveBeenCalledWith();
        });
        it('should unset saving flag', (done) => {
            spyOn(prayerLetters, 'sync').and.callFake(() => Promise.resolve());
            $ctrl.sync().then(() => {
                expect($ctrl.saving).toBeFalsy();
                done();
            });
        });
        it('should alert a translated confirmation', (done) => {
            spyOn(prayerLetters, 'sync').and.callFake(() => Promise.resolve());
            $ctrl.sync().then(() => {
                expect(alerts.addAlert).toHaveBeenCalledWith(jasmine.any(String), 'success');
                expect(gettextCatalog.getString).toHaveBeenCalledWith(jasmine.any(String));
                done();
            });
        });
        it('should handle rejection', (done) => {
            spyOn(prayerLetters, 'sync').and.callFake(() => Promise.reject({ errors: ['a'] }));
            $ctrl.sync().catch(() => {
                expect($ctrl.saving).toBeFalsy();
                expect(alerts.addAlert).toHaveBeenCalledWith(jasmine.any(String), 'danger');
                expect(gettextCatalog.getString).toHaveBeenCalledWith(jasmine.any(String));
                done();
            });
        });
    });
    describe('disconnect', () => {
        beforeEach(() => {
            spyOn(modal, 'confirm').and.callFake(() => Promise.resolve());
        });
        it('should disconnect', (done) => {
            spyOn(prayerLetters, 'disconnect').and.callFake(() => Promise.resolve());
            $ctrl.disconnect().then(() => {
                expect(prayerLetters.disconnect).toHaveBeenCalledWith();
                done();
            });
        });
        it('should unset saving flag', (done) => {
            spyOn(prayerLetters, 'disconnect').and.callFake(() => Promise.resolve());
            $ctrl.disconnect().then(() => {
                expect($ctrl.saving).toBeFalsy();
                done();
            });
        });
        it('should alert a translated confirmation', (done) => {
            spyOn(prayerLetters, 'disconnect').and.callFake(() => Promise.resolve());
            $ctrl.disconnect().then(() => {
                expect(alerts.addAlert).toHaveBeenCalledWith(jasmine.any(String), 'success');
                expect(gettextCatalog.getString).toHaveBeenCalledWith(jasmine.any(String));
                done();
            });
        });
        it('should handle rejection', (done) => {
            spyOn(prayerLetters, 'disconnect').and.callFake(() => Promise.reject());
            $ctrl.disconnect().catch(() => {
                expect($ctrl.saving).toBeFalsy();
                expect(alerts.addAlert).toHaveBeenCalledWith(jasmine.any(String), 'danger');
                expect(gettextCatalog.getString).toHaveBeenCalledWith(jasmine.any(String));
                done();
            });
        });
    });
});