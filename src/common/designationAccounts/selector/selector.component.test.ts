import component from './selector.component';

describe('selector.component', () => {
    let $ctrl, rootScope, scope, componentController, designationAccounts;

    function loadController() {
        $ctrl = componentController('designationAccountsSelector', { $scope: scope });
    }

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope,
            _designationAccounts_) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            designationAccounts = _designationAccounts_;
            componentController = $componentController;
            loadController();
        });
    });

    describe('onChange', () => {
        beforeEach(() => {
            spyOn(rootScope, '$emit').and.callFake(() => {});
            designationAccounts.selected = ['hello', 'world'];
        });

        it('should call tools.getAnalytics', () => {
            $ctrl.onChange();
            expect(rootScope.$emit).toHaveBeenCalledWith(
                'designationAccountSelectorChanged',
                designationAccounts.selected
            );
        });
    });
});
