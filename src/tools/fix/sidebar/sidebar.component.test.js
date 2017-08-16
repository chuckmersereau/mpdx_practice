import component from './sidebar.component';

describe('tools.fix.sidebar.component', () => {
    let $ctrl, rootScope, scope, componentController,
        fixAddresses, fixCommitmentInfo, fixEmailAddresses, fixPhoneNumbers, tools;

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope,
        _fixAddresses_, _fixCommitmentInfo_, _fixEmailAddresses_, _fixPhoneNumbers_, _tools_) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            fixAddresses = _fixAddresses_;
            fixCommitmentInfo = _fixCommitmentInfo_;
            fixEmailAddresses = _fixEmailAddresses_;
            fixPhoneNumbers = _fixPhoneNumbers_;
            tools = _tools_;
            componentController = $componentController;
            loadController();
        });
    });

    function loadController() {
        $ctrl = componentController('fixSidebar', { $scope: scope });
    }

    describe('$onInit', () => {
        beforeEach(() => {
            spyOn(tools, 'getAnalytics').and.returnValue();
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
