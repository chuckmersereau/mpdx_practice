import list from './display.component';

describe('common.twoPartDateDisplay.component', () => {
    let $ctrl, rootScope, scope, componentController, locale;
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

    function loadController() {
        $ctrl = componentController('twoPartDateDisplay', { $scope: scope }, {
            day: 1,
            month: 2
        });
    }
    describe('constructor', () => {
        it('should set default values', () => {
            expect($ctrl.dayFirst).toBeFalsy();
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
                { value: 1, display: 'Jan' },
                { value: 2, display: 'Feb' },
                { value: 3, display: 'Mar' },
                { value: 4, display: 'Apr' },
                { value: 5, display: 'May' },
                { value: 6, display: 'Jun' },
                { value: 7, display: 'Jul' },
                { value: 8, display: 'Aug' },
                { value: 9, display: 'Sep' },
                { value: 10, display: 'Oct' },
                { value: 11, display: 'Nov' },
                { value: 12, display: 'Dec' }
            ]);
            expect($ctrl.gettext.calls.count()).toEqual(12);
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
