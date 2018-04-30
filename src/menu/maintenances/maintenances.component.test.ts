import component from './maintenances.component';
import * as moment from 'moment';

describe('menu.maintenances.component', () => {
    let $ctrl, scope, componentController, statusPage;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _statusPage_) => {
            scope = $rootScope.$new();
            statusPage = _statusPage_;
            componentController = $componentController;
            loadController();
        });
    });

    function loadController() {
        $ctrl = componentController('menuMaintenances', { $scope: scope }, { });
    }

    describe('constructor', () => {
        it('should set services', () => {
            expect($ctrl.statusPage).toEqual(statusPage);
            expect($ctrl.moment).toEqual(moment);
        });
    });
});
