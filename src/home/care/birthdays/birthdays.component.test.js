import component from './birthdays.component';
import moment from 'moment';

describe('home.care.birthdays', () => {
    let $ctrl, contacts, locale, rootScope, scope, componentController;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _contacts_, _locale_) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            contacts = _contacts_;
            locale = _locale_;
            componentController = $componentController;
            loadController();
        });
    });

    function loadController() {
        $ctrl = componentController('birthdays', { $scope: scope }, {});
    }
    describe('constructor', () => {
        it('should expose dependencies for view', () => {
            expect($ctrl.contacts).toEqual(contacts);
            expect($ctrl.locale).toEqual(locale);
        });
        it('should set a limit for display', () => {
            expect($ctrl.limit).toEqual(5);
        });
    });
    describe('partialDateSort', () => {
        beforeEach(function() {
            jasmine.clock().install();
        });
        afterEach(function() {
            jasmine.clock().uninstall();
        });
        it('should build a numeric representation of the current month/day for sorting', () => {
            expect($ctrl.partialDateSort({ anniversary_month: 1, anniversary_day: 2 })).toEqual(102);
        });
        it('should handle pre-sorting december', () => {
            const day = moment('2015-12-22').toDate();
            jasmine.clock().mockDate(day);
            expect($ctrl.partialDateSort({ anniversary_month: 12, anniversary_day: 22 })).toEqual(22);
        });
    });
});