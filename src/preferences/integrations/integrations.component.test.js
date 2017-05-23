import component from './integrations.component';

const defaultBindings = {
    selectedTab: null,
    setup: false,
    onSave: () => new Promise(resolve => resolve())
};

describe('preferences.integrations.component', () => {
    let $ctrl, componentController, state, scope, help, rootScope, integrations;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, $state, _help_, _integrations_) => {
            help = _help_;
            rootScope = $rootScope;
            scope = rootScope.$new();
            state = $state;
            integrations = _integrations_;
            componentController = $componentController;
            $ctrl = loadController(defaultBindings);
        });
        spyOn(state, 'go').and.callFake(() => {});
        spyOn(help, 'suggest').and.callFake(() => {});
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
});