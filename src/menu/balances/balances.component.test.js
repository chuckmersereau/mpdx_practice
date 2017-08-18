import component from './balances.component';

describe('menu.balances.component', () => {
    let $ctrl, componentController, scope, rootScope, designationAccounts;

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _accounts_, _designationAccounts_) => {
            componentController = $componentController;
            rootScope = $rootScope;
            scope = rootScope.$new();
            designationAccounts = _designationAccounts_;
            loadController();
        });
    });

    function loadController() {
        $ctrl = componentController('menuBalances', { $scope: scope });
    }
    describe('$onInit', () => {
        beforeEach(() => {
            spyOn($ctrl, 'init').and.callFake(() => Promise.resolve());
        });
        it('should call init', () => {
            $ctrl.$onInit();
            expect($ctrl.init).toHaveBeenCalledWith();
        });
        it('should call init on accountListUpdated', () => {
            $ctrl.$onInit();
            rootScope.$emit('accountListUpdated');
            rootScope.$digest();
            expect($ctrl.init).toHaveBeenCalledWith(true);
        });
    });
    describe('init', () => {
        beforeEach(() => {
            spyOn(designationAccounts, 'load').and.callFake(() => Promise.resolve());
        });
        it('should load designationAccounts', () => {
            $ctrl.init();
            expect(designationAccounts.load).toHaveBeenCalledWith(false);
        });
        it('should load fresh designationAccounts', () => {
            $ctrl.init(true);
            expect(designationAccounts.load).toHaveBeenCalledWith(true);
        });
    });
});