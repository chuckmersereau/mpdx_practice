import component from './faCheckbox.component';

describe('common.faCheckbox.component', () => {
    let $ctrl, componentController, scope, rootScope;

    function loadController() {
        $ctrl = componentController('faCheckbox', { $scope: scope });
    }

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope) => {
            componentController = $componentController;
            rootScope = $rootScope;
            scope = rootScope.$new();
            loadController();
        });
    });

    xit('should do something', () => {
        expect($ctrl).toEqual(1);
    });
});
