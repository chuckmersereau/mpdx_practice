import component from './personal.component';

describe('setup.preferences.personal.component', () => {
    let $ctrl, rootScope, scope;

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            $ctrl = $componentController('setupPreferencesPersonal', { $scope: scope }, {});
        });
    });

    describe('constructor', () => {
        it('should define view objects', () => {
            expect($ctrl.accounts).toBeDefined();
            expect($ctrl.users).toBeDefined();
        });
    });
});