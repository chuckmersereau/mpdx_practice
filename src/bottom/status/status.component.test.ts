import component from './status.component';

describe('bottom.status.component', () => {
    let $ctrl, scope, componentController, statusPage;

    function loadController() {
        $ctrl = componentController('statusPage', { $scope: scope }, { });
    }

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _statusPage_) => {
            scope = $rootScope.$new();
            statusPage = _statusPage_;
            componentController = $componentController;
            loadController();
        });
    });

    describe('constructor', () => {
        it('should set services', () => {
            expect($ctrl.statusPage).toEqual(statusPage);
        });
    });
});
