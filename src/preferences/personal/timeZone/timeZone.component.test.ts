import component from './timeZone.component';

describe('preferences.personal.timeZone.component', () => {
    let $ctrl, rootScope, scope, componentController;

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            componentController = $componentController;
            loadController();
        });
    });

    function loadController() {
        $ctrl = componentController('preferencesPersonalTimeZone', { $scope: scope }, {});
    }

    describe('constructor', () => {
        it('should define view objects', () => {
            expect($ctrl.timeZone).toBeDefined();
            expect($ctrl.users).toBeDefined();
        });
        it('should set saving to false', () => {
            expect($ctrl.saving).toBeFalsy();
        });
    });
});