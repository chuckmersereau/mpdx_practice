import component from './filter.component';

describe('tasks.filter.component', () => {
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
        $ctrl = componentController('tasksFilter', { $scope: scope }, {});
    }

    describe('constructor', () => {
        xit('should do something', () => {
            expect($ctrl).toBeDefined();
        });
    });
});