import component from './facebook.component';

describe('common.links.facebook.component', () => {
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
        $ctrl = componentController('facebookLink', { $scope: scope });
    }

    xit('should do something', () => {
        expect($ctrl).toEqual(1);
    });
});
