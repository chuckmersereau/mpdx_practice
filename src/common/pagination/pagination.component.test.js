import component from './pagination.component';

describe('common.login.component', () => {
    let $ctrl, componentController, scope, rootScope;

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope) => {
            componentController = $componentController;
            rootScope = $rootScope;
            scope = rootScope.$new();
            loadController();
        });
    });

    function loadController() {
        $ctrl = componentController('pagination', { $scope: scope });
    }

    xit('should do something', () => {
        expect($ctrl).toEqual(1);
    });
});
