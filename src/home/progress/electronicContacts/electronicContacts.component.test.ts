import component from './electronicContacts.component';

describe('home.progress.electronicContacts.component', () => {
    let $ctrl, rootScope, scope;

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            $ctrl = $componentController('progressElectronicContacts', { $scope: scope }, {});
        });
    });

    describe('constructor', () => {
        it('should define view objects', () => {
            expect($ctrl.accounts).toBeDefined();
        });
    });
});