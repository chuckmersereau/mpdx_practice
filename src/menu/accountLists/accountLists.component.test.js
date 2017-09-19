import component from './accountLists.component';

describe('menu.accountLists.component', () => {
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
        $ctrl = componentController('accountLists', { $scope: scope }, {});
    }

    describe('constructor', () => {
        it('should set showAllTags false', () => {
            expect($ctrl.showAllTags).toEqual(false);
        });
    });
});