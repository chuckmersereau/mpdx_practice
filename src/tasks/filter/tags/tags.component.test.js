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
        it('should define default values', () => {
            expect($ctrl.hideTags).toEqual(true);
        });
    });
});
