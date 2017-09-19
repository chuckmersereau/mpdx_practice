import component from './google.component';

describe('preferences.integrations.google.component', () => {
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
        $ctrl = componentController('googleIntegrationPreferences', { $scope: scope }, {});
    }

    xit('should do something', () => {
        expect($ctrl).toEqual(1);
    });
});