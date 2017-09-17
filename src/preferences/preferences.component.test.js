import component from './preferences.component';
import { HelpMock } from 'common/help/help.service';

describe('preferences.component', () => {
    let $ctrl, rootScope, scope, componentController;

    beforeEach(() => {
        angular.mock.module(component);
        angular.mock.module(HelpMock);
        inject(($componentController, $rootScope) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            componentController = $componentController;
            loadController();
        });
    });

    function loadController() {
        $ctrl = componentController('preferences', { $scope: scope }, {});
    }

    describe('constructor', () => {
        it('should define view objects', () => {
            expect($ctrl.accounts).toBeDefined();
            expect($ctrl.gettextCatalog).toBeDefined();
        });
    });
});