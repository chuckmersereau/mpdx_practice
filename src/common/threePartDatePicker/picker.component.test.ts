import list from './picker.component';

describe('common.threePartDatePicker.component', () => {
    let $ctrl, rootScope, scope, componentController, locale;

    function loadController() {
        $ctrl = componentController('threePartDatePicker', { $scope: scope }, {
            day: 1,
            month: 2,
            year: 2015
        });
    }

    beforeEach(() => {
        angular.mock.module(list);
        inject(($componentController, $rootScope, _locale_) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            locale = _locale_;
            componentController = $componentController;
            loadController();
        });
    });

    describe('constructor', () => {
        it('should set default values', () => {
            expect($ctrl.dayFirst).toBeFalsy();
            expect($ctrl.yearFirst).toBeFalsy();
        });
    });

    describe('$onChanges', () => {
        beforeEach(() => {
            spyOn($ctrl, 'gettext').and.callFake((data) => data);
            locale.dateTimeFormat = 'dd/MM/yyyy';
        });

        it('should set months', () => {
            $ctrl.$onChanges();
            expect($ctrl.months).toEqual([
                { value: 1, display: 'January' },
                { value: 2, display: 'February' },
                { value: 3, display: 'March' },
                { value: 4, display: 'April' },
                { value: 5, display: 'May' },
                { value: 6, display: 'June' },
                { value: 7, display: 'July' },
                { value: 8, display: 'August' },
                { value: 9, display: 'September' },
                { value: 10, display: 'October' },
                { value: 11, display: 'November' },
                { value: 12, display: 'December' }
            ]);
            expect($ctrl.gettext.calls.count()).toEqual(12);
        });

        it('should set yearFirst', () => {
            locale.dateTimeFormat = 'yyyy/dd/MM';
            $ctrl.$onChanges();
            expect($ctrl.yearFirst).toBeTruthy();
        });

        it('should set yearFirst false', () => {
            locale.dateTimeFormat = 'dd/MM/yyyy';
            $ctrl.$onChanges();
            expect($ctrl.yearFirst).toBeFalsy();
        });

        it('should set dayFirst', () => {
            locale.dateTimeFormat = 'yyyy/dd/MM';
            $ctrl.$onChanges();
            expect($ctrl.dayFirst).toBeTruthy();
        });

        it('should set yearFirst false', () => {
            locale.dateTimeFormat = 'MM/dd/yyyy';
            $ctrl.$onChanges();
            expect($ctrl.dayFirst).toBeFalsy();
        });
    });
});
