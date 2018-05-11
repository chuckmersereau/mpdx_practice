import * as moment from 'moment';
import component from './birthdays.component';

describe('home.care.birthdays', () => {
    let $ctrl, locale, rootScope, scope, api, q;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _locale_, _api_, $q) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            api = _api_;
            locale = _locale_;
            q = $q;
            $ctrl = $componentController('birthdays', { $scope: scope }, {});
        });
    });

    describe('constructor', () => {
        it('should expose dependencies for view', () => {
            expect($ctrl.locale).toEqual(locale);
        });

        it('should set a limit for display', () => {
            expect($ctrl.limit).toEqual(5);
        });
    });

    describe('$onInit', () => {
        afterEach(() => {
            $ctrl.$onDestroy();
        });

        it('should call getBirthdaysThisWeek', () => {
            spyOn($ctrl, 'getBirthdaysThisWeek').and.callFake(() => {});
            $ctrl.$onInit();
            expect($ctrl.getBirthdaysThisWeek).toHaveBeenCalledWith();
        });

        it('should call getBirthdaysThisWeek', () => {
            spyOn($ctrl, 'getBirthdaysThisWeek').and.callFake(() => {});
            $ctrl.$onInit();
            rootScope.$emit('accountListUpdated');
            expect($ctrl.getBirthdaysThisWeek.calls.count()).toEqual(2);
        });
    });

    describe('$onDestroy', () => {
        it('should kill the watcher', () => {
            $ctrl.$onInit();
            spyOn($ctrl, 'watcher').and.callFake(() => {});
            $ctrl.$onDestroy();
            expect($ctrl.watcher).toHaveBeenCalledWith();
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
            expect($ctrl.partialDateSort({ birthday_month: 1, birthday_day: 2 })).toEqual(102);
        });

        it('should handle pre-sorting december', () => {
            const day = moment('2015-12-22').toDate();
            jasmine.clock().mockDate(day);
            expect($ctrl.partialDateSort({ birthday_month: 12, birthday_day: 22 })).toEqual(22);
        });
    });

    describe('getAnalytics', () => {
        it('should query the api', () => {
            spyOn(api, 'get').and.callFake(() => q.resolve());
            $ctrl.getBirthdaysThisWeek();
            expect(api.get).toHaveBeenCalledWith({
                url: 'contacts/analytics',
                data: {
                    include: 'birthdays_this_week,'
                    + 'birthdays_this_week.facebook_accounts,'
                    + 'birthdays_this_week.twitter_accounts,'
                    + 'birthdays_this_week.email_addresses,'
                    + 'birthdays_this_week.parent_contact',
                    fields: {
                        contact_analytics: 'birthdays_this_week',
                        people: 'birthday_day,birthday_month,birthday_year,facebook_accounts,first_name,last_name,twitter_accounts,email_addresses,parent_contact',
                        email_addresses: 'email,primary',
                        facebook_accounts: 'username',
                        twitter_accounts: 'screen_name',
                        contact: ''
                    },
                    filter: { account_list_id: api.account_list_id }
                },
                overrideGetAsPost: true
            });
        });
    });
});