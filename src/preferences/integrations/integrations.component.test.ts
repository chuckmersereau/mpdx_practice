import component from './integrations.component';

describe('preferences.integrations.component', () => {
    let $ctrl, componentController, state, scope, help, rootScope, integrations, gettextCatalog, api, q;
    beforeEach(() => {
        angular.mock.module(component);
        inject((
            $componentController, $rootScope, $state, _help_, _integrations_, _gettextCatalog_, _api_, $q
        ) => {
            help = _help_;
            rootScope = $rootScope;
            scope = rootScope.$new();
            api = _api_;
            gettextCatalog = _gettextCatalog_;
            state = $state;
            integrations = _integrations_;
            q = $q;
            componentController = $componentController;
            $ctrl = loadController();
        });
        spyOn(state, 'go').and.callFake(() => {});
        spyOn(help, 'suggest').and.callFake(() => {});
        spyOn(gettextCatalog, 'getString').and.callThrough();
    });

    function loadController() {
        return componentController('preferencesIntegration', { $scope: scope }, {
            selectedTab: null,
            setup: false,
            onSave: () => q.$resolve()
        });
    }
    describe('constructor', () => {
        beforeEach(() => {
            loadController();
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
        beforeEach(() => {
            spyOn(integrations, 'load').and.callFake(() => {});
        });
        it('should set saving flag', () => {
            spyOn(api, 'delete').and.callFake(() => q.resolve());
            $ctrl.disconnect('key');
            expect($ctrl.saving).toBeTruthy();
        });
        it('should call disconnect', () => {
            spyOn(api, 'delete').and.callFake(() => q.resolve());
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
            spyOn(api, 'delete').and.callFake(() => q.resolve());
            $ctrl.disconnect('key').then(() => {
                expect($ctrl.saving).toBeFalsy();
                done();
            });
            scope.$digest();
        });
        it('should reload integrations', (done) => {
            spyOn(api, 'delete').and.callFake(() => q.resolve());
            $ctrl.disconnect('key').then(() => {
                expect(api.delete).toHaveBeenCalled();
                done();
            });
            scope.$digest();
        });
        it('should handle rejection', (done) => {
            spyOn(api, 'delete').and.callFake(() => q.reject());
            $ctrl.disconnect('key').catch(() => {
                expect($ctrl.saving).toBeFalsy();
                done();
            });
            scope.$digest();
        });
    });
});