import component from './setup.component';

describe('setup.component', () => {
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
        $ctrl = componentController('setup', { $scope: scope });
    }

    describe('$onInit', () => {
        it('should set session.navSetup', () => {
            $ctrl.$onInit();
            expect($ctrl.session.navSetup).toBeTruthy();
        });
    });

    describe('$onDestroy', () => {
        it('should set session.navSetup', () => {
            $ctrl.$onDestroy();
            expect($ctrl.session.navSetup).toBeFalsy();
        });
    });
});
