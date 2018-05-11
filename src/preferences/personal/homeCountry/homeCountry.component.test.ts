import component from './homeCountry.component';

describe('preferences.personal.homeCountry.component', () => {
    let $ctrl, rootScope, scope;

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            $ctrl = $componentController('preferencesPersonalHomeCountry', { $scope: scope }, {});
        });
    });

    describe('constructor', () => {
        it('should define view objects', () => {
            expect($ctrl.accounts).toBeDefined();
        });

        it('should set saving to false', () => {
            expect($ctrl.saving).toBeFalsy();
        });
    });
});