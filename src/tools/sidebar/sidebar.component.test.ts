import component from './sidebar.component';

describe('tools.sidebar.component', () => {
    let $ctrl, rootScope, scope, tools;

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _tools_) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            tools = _tools_;
            $ctrl = $componentController('toolsSidebar', { $scope: scope });
        });
    });

    describe('$onInit', () => {
        beforeEach(() => {
            spyOn(tools, 'getAnalytics').and.returnValue('');
        });

        it('should have called tools.getAnalytics', () => {
            $ctrl.$onInit();
            expect(tools.getAnalytics).toHaveBeenCalled();
        });

        it('should refresh tools.getAnalytics on account swap', () => {
            $ctrl.$onInit();
            rootScope.$emit('accountListUpdated');
            rootScope.$digest();
            expect(tools.getAnalytics).toHaveBeenCalledWith(true);
        });
    });
});
