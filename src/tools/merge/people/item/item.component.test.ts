import component from './item.component';

describe('tools.merge.people.item.component', () => {
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
        $ctrl = componentController('mergePeopleItem', { $scope: scope }, {});
    }
    it('should expose people to the view', () => {
        expect($ctrl.people).toBeDefined();
    });
});