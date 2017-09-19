import component from './cover.component';

describe('common.cover.component', () => {
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
        $ctrl = componentController('cover', { $scope: scope }, {});
    }
    xit('should do something', () => {
        expect($ctrl).toEqual(1);
    });
});