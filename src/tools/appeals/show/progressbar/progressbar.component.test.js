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
        beforeEach(() => {
            $ctrl.appeal = {
                amount: 5000,
                pledges_amount_processed: 2000,
                pledges_amount_received_not_processed: 1000,
                pledges_amount_not_received_not_processed: 5000
            };
        });
        it('should handle null appeal', () => {
            $ctrl.appeal = undefined;
            $ctrl.$onChanges();
            expect($ctrl.maxValue).toEqual(1);
        });
        it('should handle null pledges_amount_processed', () => {
            $ctrl.appeal.pledges_amount_processed = undefined;
            $ctrl.$onChanges();
            expect($ctrl.givenWidth).toEqual(0);
        });
        it('should handle null pledges_amount_received_not_processed', () => {
            $ctrl.appeal.pledges_amount_received_not_processed = undefined;
            $ctrl.$onChanges();
            expect($ctrl.receivedWidth).toEqual(0);
        });
        it('should handle null pledges_amount_not_received_not_processed', () => {
            $ctrl.appeal.pledges_amount_not_received_not_processed = undefined;
            $ctrl.$onChanges();
            expect($ctrl.committedWidth).toEqual(0);
        });
        it('should set max value to amount', () => {
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
        it('should calculate givenWidth', () => {
            $ctrl.$onChanges();
            expect($ctrl.givenWidth).toEqual(40);
        });
        it('should calculate receivedWidth', () => {
            $ctrl.$onChanges();
            expect($ctrl.receivedWidth).toEqual(20);
        });
        it('should calculate committedWidth', () => {
            $ctrl.$onChanges();
            expect($ctrl.committedWidth).toEqual(40);
        });
        it('should handle overage on received as well', () => {
            $ctrl.appeal.pledges_amount_processed = 4500;
            $ctrl.$onChanges();
            expect($ctrl.receivedWidth).toEqual(10);
            expect($ctrl.committedWidth).toEqual(0);
        });
        it('should handle negative availability', () => {
            $ctrl.appeal.pledges_amount_processed = 45000;
            $ctrl.$onChanges();
            expect($ctrl.receivedWidth).toEqual(0);
            expect($ctrl.committedWidth).toEqual(0);
        });
        it('should handle negative availability', () => {
            $ctrl.appeal.pledges_amount_received_not_processed = 45000;
            $ctrl.$onChanges();
            expect($ctrl.receivedWidth).toEqual(60);
            expect($ctrl.committedWidth).toEqual(0);
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
