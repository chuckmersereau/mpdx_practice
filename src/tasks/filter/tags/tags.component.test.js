import component from './tags.component';

describe('tasks.tags', () => {
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
        $ctrl = componentController('tasksTags', { $scope: scope }, {});
    }

    describe('constructor', () => {
        xit('should define view objects', () => {
            expect($ctrl.tasks).toBeDefined();
        });
    });
});