import component from './accounts.component';

describe('setup.preferences.accounts.component', () => {
    let $ctrl, rootScope, scope;

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            $ctrl = $componentController('setupPreferencesAccounts', { $scope: scope }, {});
        });
    });

    describe('constructor', () => {
        it('should define view objects', () => {
            expect($ctrl.accounts).toBeDefined();
            expect($ctrl.users).toBeDefined();
        });

        it('should set selectedTab to merge_account', () => {
            expect($ctrl.selectedTab).toEqual('merge_account');
        });
    });
});