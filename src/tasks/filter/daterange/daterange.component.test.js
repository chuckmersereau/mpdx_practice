import component from './daterange.component';

describe('tasks.filter.daterange', () => {
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
        $ctrl = componentController('tasksFilterDaterange', { $scope: scope }, {});
    }

    describe('constructor', () => {
        xit('should do something', () => {
            expect($ctrl).toBeDefined();
        });
    });
});