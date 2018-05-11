import component from './menu.component';

describe('menu.component', () => {
    let $ctrl, rootScope, scope, tools;

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope,
            _tools_) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            tools = _tools_;
            $ctrl = $componentController('menu', { $scope: scope });
        });
    });

    describe('$onInit', () => {
        beforeEach(() => {
            spyOn(tools, 'getAnalytics').and.callFake(() => {});
        });

        it('should call tools.getAnalytics', () => {
            $ctrl.$onInit();
            expect(tools.getAnalytics).toHaveBeenCalled();
        });

        it('should refresh tools.getAnalytics on accountListUpdated', () => {
            $ctrl.$onInit();
            rootScope.$emit('accountListUpdated');
            rootScope.$digest();
            expect(tools.getAnalytics).toHaveBeenCalledWith(true);
        });

        describe('setup', () => {
            it('should not tools.getAnalytics', () => {
                $ctrl.setup = true;
                $ctrl.$onInit();
                expect(tools.getAnalytics).not.toHaveBeenCalled();
            });
        });
    });
});
