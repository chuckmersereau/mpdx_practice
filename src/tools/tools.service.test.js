import service from './tools.service';

const accountListId = 123;

describe('tools.service', () => {
    let gettextCatalog, api, tools;

    beforeEach(() => {
        angular.mock.module(service);
        inject(($rootScope, _gettextCatalog_, _api_, _tools_) => {
            gettextCatalog = _gettextCatalog_;
            api = _api_;
            tools = _tools_;
            api.account_list_id = accountListId;
        });
    });

    describe('constructor', () => {
        it('should set default values', () => {
            expect(tools.data).toEqual([
                {
                    title: gettextCatalog.getString('Appeals'),
                    icon: 'fa fa-trophy',
                    link: 'tools.appeals',
                    description: gettextCatalog.getString('Set goals, create asks, and track progress for one time needs'),
                    enabled: true
                },
                {
                    title: gettextCatalog.getString('Import from Google'),
                    icon: 'fa fa-google',
                    link: 'tools.import.google',
                    description: gettextCatalog.getString('Import your contact information from your Google account'),
                    enabled: true,
                    imports: true
                },
                {
                    title: gettextCatalog.getString('Import from CSV'),
                    icon: 'fa fa-table',
                    link: 'tools.import.csv',
                    description: gettextCatalog.getString('Import contacts you have saved in a CSV file'),
                    enabled: true,
                    imports: true
                },
                {
                    title: gettextCatalog.getString('Import from TntConnect'),
                    icon: 'fa fa-cloud-upload',
                    link: 'tools.import.tnt',
                    description: gettextCatalog.getString('Import your contacts from your TntConnect database'),
                    enabled: true,
                    imports: true
                },
                {
                    title: gettextCatalog.getString('Fix Commitment Info'),
                    icon: 'fa fa-usd',
                    link: 'tools.fix.commitmentInfo',
                    description: gettextCatalog.getString('Set the correct contacts commitment info for each contact'),
                    enabled: true,
                    analyticKey: 'fix-commitment-info'
                },
                {
                    title: gettextCatalog.getString('Fix Email Addresses'),
                    icon: 'fa fa-envelope-o',
                    link: 'tools.fix.emailAddresses',
                    description: gettextCatalog.getString('Set the correct primary email address for each person'),
                    enabled: true,
                    analyticKey: 'fix-email-addresses'
                },
                {
                    title: gettextCatalog.getString('Fix Mailing Addresses'),
                    icon: 'fa fa-map',
                    link: 'tools.fix.addresses',
                    description: gettextCatalog.getString('Set the correct primary mailing address for each contact'),
                    enabled: true,
                    analyticKey: 'fix-addresses'
                },
                {
                    title: gettextCatalog.getString('Fix Phone Numbers'),
                    icon: 'fa fa-phone-square',
                    link: 'tools.fix.phoneNumbers',
                    description: gettextCatalog.getString('Set the correct primary phone number for each person'),
                    enabled: true,
                    analyticKey: 'fix-phone-numbers'
                },
                {
                    title: gettextCatalog.getString('Fix Send Newsletter'),
                    icon: 'fa fa-newspaper-o',
                    link: 'tools.fix.sendNewsletter',
                    description: gettextCatalog.getString('Set the correct newsletter state for each contact'),
                    enabled: true,
                    analyticKey: 'fix-send-newsletter'
                },
                {
                    title: gettextCatalog.getString('Merge Contacts'),
                    icon: 'fa fa-home',
                    link: 'tools.merge.contacts',
                    description: gettextCatalog.getString('Review and merge duplicate contacts'),
                    enabled: true,
                    analyticKey: 'duplicate-contacts'
                },
                {
                    title: gettextCatalog.getString('Merge People'),
                    icon: 'fa fa-users',
                    link: 'tools.merge.people',
                    description: gettextCatalog.getString('Review and merge duplicate people'),
                    enabled: true,
                    analyticKey: 'duplicate-people'
                }
            ]);
            expect(tools.analytics).toEqual({});
        });
    });

    describe('getAnalytics', () => {
        beforeEach(() => {
            tools.analytics = null;
            spyOn(api, 'get').and.callFake(() => Promise.resolve({
                'counts_by_type': [
                    {
                        'counts': [
                            {
                                'type': 'fix-commitment-info',
                                'count': 190
                            },
                            {
                                'type': 'fix-phone-numbers',
                                'count': 3
                            }
                        ]
                    }
                ]
            }));
        });

        it('should return cached value if not a reset and cached data has more than one key', (done) => {
            const cachedData = { 'fix-phone-numbers': 0, 'fix-commitment-info': 2 };
            tools.analytics = cachedData;
            tools.getAnalytics().then((data) => {
                expect(data).toEqual(cachedData);
                done();
            });
        });

        it('should call api if not a reset and cached data has with only one key', (done) => {
            const cachedData = { 'fix-phone-numbers': 0 };
            tools.analytics = cachedData;
            tools.getAnalytics().then((data) => {
                expect(data).toEqual({
                    'fix-commitment-info': 190,
                    'fix-phone-numbers': 3
                });
                done();
            });
        });

        it('should call the api', () => {
            tools.getAnalytics();
            expect(api.get).toHaveBeenCalledWith('tools/analytics', { filter: { account_list_id: accountListId } });
        });

        it('should return promise', () => {
            expect(tools.getAnalytics()).toEqual(jasmine.any(Promise));
        });

        describe('promise successful', () => {
            it('deserialize data to object', (done) => {
                tools.getAnalytics().then((data) => {
                    expect(data).toEqual({
                        'fix-commitment-info': 190,
                        'fix-phone-numbers': 3
                    });
                    done();
                });
            });
        });
    });

    describe('getTotal', () => {
        it('adds together tools.analytics', () => {
            tools.analytics = {
                'fix-commitment-info': 10,
                'fix-phone-numbers': 5
            };
            expect(tools.getTotal()).toEqual(15);
        });
    });
});
