import component from './filter.component';

describe('contacts.filter.component', () => {
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
        $ctrl = componentController('contactsFilter', { $scope: scope }, {});
    }
    xit('should do something', () => {
        expect($ctrl).toEqual(1);
    });
});