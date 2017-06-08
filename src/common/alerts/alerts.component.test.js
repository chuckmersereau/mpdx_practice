import component from './alerts.component';

describe('common.alerts.component', () => {
    let $ctrl, componentController, scope, rootScope, alerts;

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _alerts_) => {
            componentController = $componentController;
            rootScope = $rootScope;
            scope = rootScope.$new();
            alerts = _alerts_;
            loadController();
        });
    });

    function loadController() {
        $ctrl = componentController('alerts', { $scope: scope });
    }

    describe('constructor', () => {
        it('should set default values', () => {
            expect($ctrl.alerts).toEqual(alerts);
        });
    });
});
