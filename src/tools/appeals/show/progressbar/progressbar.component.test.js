import component from './progressbar.component';



describe('tools.appeals.show.progressbar.component', () => {
    let $ctrl, scope;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope) => {
            scope = $rootScope.$new();
            $ctrl = $componentController('appealsProgressbar', { $scope: scope }, {});
        });
    });
    describe('$onChanges', () => {
        it('should set max value to amount', () => {
            $ctrl.appeal = {
                amount: 5000
            };
            $ctrl.$onChanges();
            expect($ctrl.maxValue).toEqual(5000);
        });
        it('should set max value to 1 if 0 to avoid divide by 0', () => {
            $ctrl.appeal = {
                amount: 0
            };
            $ctrl.$onChanges();
            expect($ctrl.maxValue).toEqual(1);
        });
    });
    describe('getWidth', () => {
        it('should calculate width', () => {
            $ctrl.appeal = {
                pledges_amount_not_received_not_processed: 1000,
                pledges_amount_received_not_processed: 2000,
                pledges_amount_processed: 500,
                amount: 5000
            };
            $ctrl.$onChanges();
            expect($ctrl.getWidth(4000)).toEqual(80);
        });
    });
});
