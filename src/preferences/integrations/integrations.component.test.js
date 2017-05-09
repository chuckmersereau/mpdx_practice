import component from './integrations.component';
import assign from 'lodash/fp/assign';

const defaultBindings = {
    selectedTab: null,
    setup: false,
    onSave: () => new Promise(resolve => resolve())
};

describe('preferences.integrations.component', () => {
    let $ctrl, componentController, state, scope, help;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, $state, _help_) => {
            help = _help_;
            scope = $rootScope.$new();
            state = $state;
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