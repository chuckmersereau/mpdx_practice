import component from './phone.component';

describe('home.progress.phone.component', () => {
    let $ctrl, rootScope, scope;

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            $ctrl = $componentController('progressPhoneDials', { $scope: scope }, {});
        });
    });

    describe('constructor', () => {
        it('should define view objects', () => {
            expect($ctrl.accounts).toBeDefined();
        });
    });
});