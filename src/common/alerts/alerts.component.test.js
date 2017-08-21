import component from './alerts.component';

describe('common.alerts.component', () => {
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
        $ctrl = componentController('alerts', { $scope: scope });
    }

    describe('constructor', () => {
        it('should set dependency exports', () => {
            expect($ctrl.alerts).toBeDefined();
        });
    });

    describe('$onInit', () => {
        describe('modal binding is set', () => {
            beforeEach(() => {
                $ctrl = componentController('alerts', { $scope: scope }, { modal: true });
            });

            it('should set modal to binding value', () => {
                $ctrl.$onInit();
                expect($ctrl.modal).toBeDefined();
            });
        });

        describe('modal binding is not set', () => {
            beforeEach(() => {
                $ctrl = componentController('alerts', { $scope: scope }, {});
            });

            it('should set modal', () => {
                $ctrl.$onInit();
                expect($ctrl.modal).toEqual(false);
            });
        });

        describe('paddingOnly binding is set', () => {
            beforeEach(() => {
                $ctrl = componentController('alerts', { $scope: scope }, { paddingOnly: true });
            });

            it('should set modal to binding value', () => {
                $ctrl.$onInit();
                expect($ctrl.paddingOnly).toBeDefined();
            });
        });

        describe('paddingOnly binding is not set', () => {
            beforeEach(() => {
                $ctrl = componentController('alerts', { $scope: scope }, {});
            });

            it('should set modal', () => {
                $ctrl.$onInit();
                expect($ctrl.paddingOnly).toEqual(false);
            });
        });
    });
});
