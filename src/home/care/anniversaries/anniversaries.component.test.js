import component from './anniversaries.component';
import moment from 'moment';

describe('home.care.anniversaries', () => {
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
            spyOn(api, 'get').and.callFake(() => Promise.resolve());
            $ctrl.getAnniversaries();
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
        it('should transform anniversaries to dates', (done) => {
            const transformable = {
                anniversaries_this_week: [{
                    people: [{
                        anniversary_year: 2015,
                        anniversary_day: 1,
                        anniversary_month: 1
                    }]
                }]
            };
            spyOn(api, 'get').and.callFake(() => Promise.resolve(transformable));
            $ctrl.getAnniversaries().then((data) => {
                expect(moment(data[0].people[0].anniversary_date).format('M-D-YYYY')).toEqual('1-1-2015');
                done();
            });
        });
        it('should handle bad anniversary years', (done) => {
            const transformable = {
                anniversaries_this_week: [{
                    people: [{
                        anniversary_day: 1,
                        anniversary_month: 1
                    }]
                }]
            };
            spyOn(api, 'get').and.callFake(() => Promise.resolve(transformable));
            $ctrl.getAnniversaries().then((data) => {
                expect(data.length).toBe(0);
                done();
            });
        });
        it('should handle bad anniversaries', (done) => {
            const transformable = {
                anniversaries_this_week: [{
                    people: [{
                        anniversary_year: 15,
                        anniversary_day: 1,
                        anniversary_month: 1
                    }]
                }, null]
            };
            spyOn(api, 'get').and.callFake(() => Promise.resolve(transformable));
            $ctrl.getAnniversaries().then((data) => {
                expect(data).toEqual([]);
                done();
            });
        });
    });
});