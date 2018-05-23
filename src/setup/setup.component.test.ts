import component from './setup.component';

describe('setup.component', () => {
    let $ctrl, scope, rootScope;

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            $ctrl = $componentController('setup', { $scope: scope });
        });
    });

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
