import component from './monthly.component';

describe('reports.monthly.component', () => {
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
        $ctrl = componentController('monthly', { $scope: scope }, {});
    }

    describe('constructor', () => {
        it('should define view objects', () => {
            expect($ctrl.api).toBeDefined();
        });
    });
});