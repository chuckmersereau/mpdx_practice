import component from './integrations.component';

const defaultBindings = {
    selectedTab: null,
    setup: false,
    onSave: () => new Promise(resolve => resolve())
};

describe('preferences.integrations.component', () => {
    let $ctrl, componentController, state, scope, help, rootScope, integrations, alerts, gettextCatalog;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, $state, _help_, _integrations_, _alerts_, _gettextCatalog_) => {
            help = _help_;
            rootScope = $rootScope;
            scope = rootScope.$new();
            alerts = _alerts_;
            gettextCatalog = _gettextCatalog_;
            state = $state;
            integrations = _integrations_;
            componentController = $componentController;
            $ctrl = loadController(defaultBindings);
        });
        spyOn(state, 'go').and.callFake(() => {});
        spyOn(help, 'suggest').and.callFake(() => {});
        spyOn(alerts, 'addAlert').and.callFake(data => data);
        spyOn(gettextCatalog, 'getString').and.callThrough();
    });
    function loadController(bindings) {
        return componentController('preferencesIntegration', {$scope: scope}, bindings);
    }
    describe('constructor', () => {
        beforeEach(() => {
            loadController(defaultBindings);
        });
        it('should have help', () => {
            expect(help.suggest).toHaveBeenCalled();
        });
    });
    describe('events', () => {
        beforeEach(() => {
            spyOn(integrations, 'load').and.callFake(() => {});
        });
        it('should reload integration data on account list change', () => {
            rootScope.$emit('accountListUpdated');
            rootScope.$digest();
            expect(integrations.load).toHaveBeenCalled();
        });
    });
    describe('tabSelectable', () => {
        it('should allow tabs to be selectable by default', () => {
            expect($ctrl.tabSelectable()).toBeTruthy();
        });
        it('should not allow tabs to be selectable when selectedTab does not match', () => {
            $ctrl.selectedTab = 'google';
            expect($ctrl.tabSelectable('key')).toBeFalsy();
        });
        it('should allow tabs to be selectable under when selectedTab matches', () => {
            $ctrl.selectedTab = 'google';
            expect($ctrl.tabSelectable('google')).toBeTruthy();
        });
    });
    describe('disconnect', () => {
        it('should set saving flag', () => {
            spyOn(integrations, 'disconnect').and.callFake(() => Promise.resolve());
            $ctrl.disconnect('google');
            expect($ctrl.saving).toBeTruthy();
        });
        it('should call disconnect', () => {
            spyOn(integrations, 'disconnect').and.callFake(() => Promise.resolve());
            $ctrl.disconnect('google');
            expect(integrations.disconnect).toHaveBeenCalledWith('google');
        });
        it('should unset saving flag', done => {
            spyOn(integrations, 'disconnect').and.callFake(() => Promise.resolve());
            $ctrl.disconnect('google').then(() => {
                expect($ctrl.saving).toBeFalsy();
                done();
            });
        });
        it('should alert a translated confirmation', done => {
            spyOn(integrations, 'disconnect').and.callFake(() => Promise.resolve());
            $ctrl.disconnect('google').then(() => {
                expect(alerts.addAlert).toHaveBeenCalledWith(jasmine.any(String), 'success');
                expect(gettextCatalog.getString).toHaveBeenCalledWith(jasmine.any(String), { service: 'google' });
                done();
            });
        });
        it('should reload integrations', done => {
            spyOn(integrations, 'disconnect').and.callFake(() => Promise.resolve());
            spyOn(integrations, 'load').and.callFake(() => Promise.resolve());
            $ctrl.disconnect('google').then(() => {
                expect(integrations.load).toHaveBeenCalled();
                done();
            });
        });
        it('should handle rejection', done => {
            spyOn(integrations, 'disconnect').and.callFake(() => Promise.reject(Error('')));
            $ctrl.disconnect('google').catch(() => {
                expect($ctrl.saving).toBeFalsy();
                expect(alerts.addAlert).toHaveBeenCalledWith(jasmine.any(String), 'danger');
                expect(gettextCatalog.getString).toHaveBeenCalledWith(jasmine.any(String), { service: 'google', error: undefined });
                done();
            });
        });
    });
});