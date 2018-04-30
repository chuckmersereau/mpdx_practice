import component from './daterange.component';
import * as moment from 'moment';

const foundElement = {
    daterangepicker: () => {
        return {};
    },
    on: () => {}
};
const element = {
    find: () => {
        return foundElement;
    }
};
describe('contacts.sidebar.filter.daterange.component', () => {
    let $ctrl, rootScope, scope, componentController, gettextCatalog;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _gettextCatalog_) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            gettextCatalog = _gettextCatalog_;
            componentController = $componentController;
            loadController();
        });
        spyOn(gettextCatalog, 'getPlural').and.callThrough();
    });

    function loadController() {
        $ctrl = componentController('contactsFilterDaterange', {
            $scope: scope,
            $element: element
        }, {
            locale: 'en'
        });
    }
    describe('constructor', () => {
        it('should define global dependencies', () => {
            expect($ctrl.gettextCatalog).toBeDefined();
            expect($ctrl.$element).toBeDefined();
        });
    });
    describe('$onInit', () => {
        beforeEach(function() {
            jasmine.clock().install();
        });
        afterEach(function() {
            jasmine.clock().uninstall();
        });
        it('should build the options for the jq daterange picker', () => {
            const day = moment('2015-12-22').toDate();
            jasmine.clock().mockDate(day);
            $ctrl.$onInit();
            expect($ctrl.options).toEqual({
                autoUpdateInput: false,
                showDropdowns: true,
                alwaysShowCalendars: true,
                drops: 'up',
                ranges: jasmine.any(Object),
                locale: 'en'
            });
            expect(moment(day).subtract(6, 'days').isSame($ctrl.options.ranges['Last 7 Days'][0], 'date')).toBeTruthy();
            expect(moment(day).isSame($ctrl.options.ranges['Last 7 Days'][1], 'date')).toBeTruthy();
            expect(moment(day).subtract(29, 'days').isSame($ctrl.options.ranges['Last 30 Days'][0], 'date')).toBeTruthy();
            expect(moment(day).isSame($ctrl.options.ranges['Last 30 Days'][1], 'date')).toBeTruthy();
            expect(moment(day).startOf('month').isSame($ctrl.options.ranges['This Month'][0], 'date')).toBeTruthy();
            expect(moment(day).endOf('month').isSame($ctrl.options.ranges['This Month'][1], 'date')).toBeTruthy();
            expect(moment(day).subtract(1, 'month').startOf('month').isSame($ctrl.options.ranges['Last Month'][0], 'date')).toBeTruthy();
            expect(moment(day).subtract(1, 'month').endOf('month').isSame($ctrl.options.ranges['Last Month'][1], 'date')).toBeTruthy();
            expect(moment(day).subtract(1, 'month').startOf('year').isSame($ctrl.options.ranges['This Year'][0], 'date')).toBeTruthy();
            expect(moment(day).subtract(1, 'month').endOf('year').isSame($ctrl.options.ranges['This Year'][1], 'date')).toBeTruthy();
            expect(moment(day).startOf('month').subtract(13, 'months').isSame($ctrl.options.ranges['Last 13 Months'][0], 'date')).toBeTruthy();
            expect(moment(day).isSame($ctrl.options.ranges['Last 13 Months'][1], 'date')).toBeTruthy();
        });
        it('should initialize the jq datepicker', () => {
            spyOn(foundElement, 'daterangepicker').and.callFake(() => {});
            $ctrl.$onInit();
            expect(foundElement.daterangepicker).toHaveBeenCalledWith($ctrl.options);
        });
        it('should set the datepicker on event', () => {
            spyOn(foundElement, 'on').and.callFake(() => {});
            $ctrl.apply = 'apply';
            $ctrl.$onInit();
            expect(foundElement.on).toHaveBeenCalledWith('apply.daterangepicker', 'apply');
        });
        it('should set the datepicker cancel event', () => {
            spyOn(foundElement, 'on').and.callFake(() => {});
            $ctrl.cancel = 'cancel';
            $ctrl.$onInit();
            expect(foundElement.on).toHaveBeenCalledWith('cancel.daterangepicker', 'cancel');
        });
        it('should call parseCustomOptions', () => {
            spyOn($ctrl, 'parseCustomOptions').and.callFake(() => {});
            $ctrl.$onInit();
            expect($ctrl.parseCustomOptions).toHaveBeenCalledWith();
        });
    });
    describe('parseCustomOptions', () => {
        it('should set ranges', () => {
            $ctrl.customOptions = [{ name: 'a', start: '2015-12-22', end: '2015-12-23' }];
            $ctrl.parseCustomOptions();
            expect(moment('2015-12-22').isSame($ctrl.ranges.a[0], 'date')).toBeTruthy();
            expect(moment('2015-12-23').isSame($ctrl.ranges.a[1], 'date')).toBeTruthy();
        });
    });
});