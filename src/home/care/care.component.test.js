import component from './care.component';

describe('home.care.component', () => {
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
        $ctrl = componentController('homeCare', { $scope: scope }, {});
    }

    describe('constructor', () => {
        it('should define view objects', () => {
            expect($ctrl.tasks).toBeDefined();
        });
    });
});