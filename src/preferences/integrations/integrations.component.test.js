import component from './integrations.component';

const defaultBindings = {
    selectedTab: null,
    setup: false,
    onSave: () => new Promise((resolve) => resolve())
};

describe('preferences.integrations.component', () => {
    let $ctrl, componentController, state, scope, help, rootScope, integrations, gettextCatalog, api;
    beforeEach(() => {
        angular.mock.module(component);
        inject((
            $componentController, $rootScope, $state, _help_, _integrations_, _gettextCatalog_, _api_
        ) => {
            help = _help_;
            rootScope = $rootScope;
            scope = rootScope.$new();
            api = _api_;
            gettextCatalog = _gettextCatalog_;
            state = $state;
            integrations = _integrations_;
            componentController = $componentController;
            $ctrl = loadController(defaultBindings);
        });
        spyOn(state, 'go').and.callFake(() => {});
        spyOn(help, 'suggest').and.callFake(() => {});
        spyOn(gettextCatalog, 'getString').and.callThrough();
    });

    function loadController(bindings) {
        return componentController('preferencesIntegration', { $scope: scope }, bindings);
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
            spyOn(api, 'delete').and.callFake(() => Promise.resolve());
            $ctrl.disconnect('key');
            expect($ctrl.saving).toBeTruthy();
        });
        it('should call disconnect', () => {
            spyOn(api, 'delete').and.callFake(() => Promise.resolve());
            $ctrl.disconnect('key', 1);
            expect(gettextCatalog.getString).toHaveBeenCalledWith('MPDX removed your integration with {{service}}.', { service: 'key' });
            expect(gettextCatalog.getString).toHaveBeenCalledWith('MPDX couldn\'t save your configuration changes for {{service}}.', { service: 'key' });
            expect(api.delete).toHaveBeenCalledWith(
                'user/key_accounts/1',
                undefined,
                'MPDX removed your integration with key.',
                'MPDX couldn\'t save your configuration changes for key.'
            );
        });
        it('should unset saving flag', (done) => {
            spyOn(api, 'delete').and.callFake(() => Promise.resolve());
            $ctrl.disconnect('key').then(() => {
                expect($ctrl.saving).toBeFalsy();
                done();
            });
        });
        it('should reload integrations', (done) => {
            spyOn(api, 'delete').and.callFake(() => Promise.resolve());
            $ctrl.disconnect('key').then(() => {
                expect(api.delete).toHaveBeenCalled();
                done();
            });
        });
        it('should handle rejection', (done) => {
            spyOn(api, 'delete').and.callFake(() => Promise.reject());
            $ctrl.disconnect('key').catch(() => {
                expect($ctrl.saving).toBeFalsy();
                done();
            });
        });
    });
});