import component from './anniversaries.component';
import * as moment from 'moment';

describe('home.care.anniversaries', () => {
    let $ctrl, locale, rootScope, scope, componentController, api, q;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _locale_, _api_, $q) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            api = _api_;
            locale = _locale_;
            q = $q;
            componentController = $componentController;
            loadController();
        });
    });

    function loadController() {
        $ctrl = componentController('anniversaries', { $scope: scope }, {});
    }
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
        it('should call getAnniversariesThisWeek', () => {
            spyOn($ctrl, 'getAnniversariesThisWeek').and.callFake(() => {});
            $ctrl.$onInit();
            expect($ctrl.getAnniversariesThisWeek).toHaveBeenCalledWith();
        });
        it('should call getAnniversariesThisWeek', () => {
            spyOn($ctrl, 'getAnniversariesThisWeek').and.callFake(() => {});
            $ctrl.$onInit();
            rootScope.$emit('accountListUpdated');
            expect($ctrl.getAnniversariesThisWeek.calls.count()).toEqual(2);
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
            expect($ctrl.partialDateSort({ people: [{ anniversary_month: 1, anniversary_day: 2 }] })).toEqual(102);
        });
        it('should handle pre-sorting december', () => {
            const day = moment('2015-12-22').toDate();
            jasmine.clock().mockDate(day);
            expect($ctrl.partialDateSort({ people: [{ anniversary_month: 12, anniversary_day: 22 }] })).toEqual(22);
        });
    });
    describe('getAnalytics', () => {
        it('should query the api', () => {
            spyOn(api, 'get').and.callFake(() => q.resolve());
            $ctrl.getAnniversariesThisWeek();
            expect(api.get).toHaveBeenCalledWith({
                url: 'contacts/analytics',
                data: {
                    include: 'anniversaries_this_week,'
                    + 'anniversaries_this_week.people,'
                    + 'anniversaries_this_week.people.facebook_accounts,'
                    + 'anniversaries_this_week.people.twitter_accounts,'
                    + 'anniversaries_this_week.people.email_addresses,',
                    fields: {
                        contact_analytics: 'anniversaries_this_week',
                        contacts: 'people',
                        people: 'anniversary_day,anniversary_month,anniversary_year,facebook_accounts,first_name,last_name,twitter_accounts,email_addresses,parent_contact',
                        email_addresses: 'email,primary',
                        facebook_accounts: 'username',
                        twitter_accounts: 'screen_name'
                    },
                    filter: { account_list_id: api.account_list_id }
                },
                overrideGetAsPost: true
            });
        });
    });
});