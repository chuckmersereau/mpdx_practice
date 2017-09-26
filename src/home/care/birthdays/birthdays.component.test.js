import component from './birthdays.component';
import moment from 'moment';

describe('home.care.birthdays', () => {
    let $ctrl, locale, rootScope, scope, componentController, api;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _locale_, _api_) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            api = _api_;
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
            spyOn(api, 'get').and.callFake(() => Promise.resolve());
            $ctrl.getBirthdays();
            expect(api.get).toHaveBeenCalledWith({
                url: 'contacts/analytics',
                data: {
                    include: 'birthdays_this_week,'
                    + 'birthdays_this_week.facebook_accounts,'
                    + 'birthdays_this_week.twitter_accounts,'
                    + 'birthdays_this_week.email_addresses',
                    fields: {
                        contact_analytics: 'birthdays_this_week',
                        people: 'birthday_day,birthday_month,birthday_year,facebook_accounts,first_name,last_name,twitter_accounts,email_addresses,parent_contact',
                        email_addresses: 'email,primary',
                        facebook_accounts: 'username',
                        twitter_accounts: 'screen_name'
                    },
                    filter: { account_list_id: api.account_list_id }
                },
                overrideGetAsPost: true
            });
        });
        it('should transform birthdays dates', (done) => {
            const transformable = {
                birthdays_this_week: [{
                    birthday_year: 2015,
                    birthday_day: 1,
                    birthday_month: 1
                }]
            };
            spyOn(api, 'get').and.callFake(() => Promise.resolve(transformable));
            $ctrl.getBirthdays().then((data) => {
                expect(moment(data[0].birthday_date).format('M-D-YYYY')).toEqual('1-1-2015');
                done();
            });
        });
        it('should handle bad birthday years', (done) => {
            const transformable = {
                birthdays_this_week: [{
                    birthday_day: 1,
                    birthday_month: 1
                }]
            };
            spyOn(api, 'get').and.callFake(() => Promise.resolve(transformable));
            $ctrl.getBirthdays().then((data) => {
                expect(data.length).toBe(0);
                done();
            });
        });
        it('should handle bad birthdays', (done) => {
            const transformable = {
                birthdays_this_week: [{
                    birthday_year: 6,
                    birthday_day: 1,
                    birthday_month: 1
                }, null]
            };
            spyOn(api, 'get').and.callFake(() => Promise.resolve(transformable));
            $ctrl.getBirthdays().then((data) => {
                expect(data).toEqual([]);
                done();
            });
        });
    });
});