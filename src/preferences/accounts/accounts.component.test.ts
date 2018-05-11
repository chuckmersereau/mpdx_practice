import component from './accounts.component';

describe('preferences.accounts.component', () => {
    let $ctrl, rootScope, scope;

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            $ctrl = $componentController('preferencesAccounts', { $scope: scope }, {});
        });
    });

    xit('should do something', () => {
        expect($ctrl).toEqual(1);
    });
});