import * as moment from 'moment';
import component from './incidents.component';

describe('menu.incidents.component', () => {
    let $ctrl, scope, statusPage;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _statusPage_) => {
            scope = $rootScope.$new();
            statusPage = _statusPage_;
            $ctrl = $componentController('menuIncidents', { $scope: scope }, { });
        });
    });

    describe('constructor', () => {
        it('should set services', () => {
            expect($ctrl.statusPage).toEqual(statusPage);
            expect($ctrl.moment).toEqual(moment);
        });
    });
});
