import component from './personal.component';

describe('setup.preferences.personal.component', () => {
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
        $ctrl = componentController('setupPreferencesPersonal', { $scope: scope }, {});
    }

    describe('constructor', () => {
        it('should define view objects', () => {
            expect($ctrl.accounts).toBeDefined();
            expect($ctrl.alerts).toBeDefined();
            expect($ctrl.users).toBeDefined();
        });
    });
});