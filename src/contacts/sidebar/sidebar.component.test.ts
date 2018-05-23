import component from './sidebar.component';

describe('contacts.sidebar.component', () => {
    let $ctrl, rootScope, scope;

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            $ctrl = $componentController('contactsSidebar', { $scope: scope }, {});
        });
    });

    describe('constructor', () => {
        it('should define view objects', () => {
            expect($ctrl.session).toBeDefined();
            expect($ctrl.contactFilter).toBeDefined();
        });
    });
});