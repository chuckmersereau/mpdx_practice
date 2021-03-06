import * as moment from 'moment';
import { assign, constant, times } from 'lodash/fp';
import component from './contributions.component';

const loadData = {
    currencies: [
        {
            code: 'NZD',
            code_symbol_string: 'NZD ($)',
            name: 'New Zealand dollar',
            symbol: '$',
            totals: {
                year: '25.0',
                year_converted: 25,
                months: [50, 0],
                minimum: 1,
                maximum: 30,
                average: 20
            },
            donors: [
                {
                    contact: {
                        contact_id: 'contact_id_2',
                        contact_name: 'Abraham, Adam',
                        late_by_30_days: false,
                        late_by_60_days: false,
                        pledge_amount: '25.0',
                        pledge_currency: 'NZD',
                        pledge_frequency: null,
                        status: 'Never Contacted'
                    },
                    monthlyDonations: [
                        {
                            donations: [
                                {
                                    date: '2016-05-19',
                                    amount: '25.0',
                                    currency: {
                                        code: 'NZD',
                                        symbol: '$'
                                    }
                                }
                            ],
                            total: 25,
                            nativeTotal: 25,
                            convertedTotal: 25
                        },
                        { donations: [], total: 0, nativeTotal: 0, convertedTotal: 0 }
                    ],
                    average: 12.5,
                    maximum: 25,
                    minimum: 25,
                    total: 25
                }, {
                    contact: {
                        contact_id: 'contact_id_1',
                        contact_name: 'Smith, Sarah',
                        late_by_30_days: false,
                        late_by_60_days: false,
                        pledge_amount: '25.0',
                        pledge_currency: 'NZD',
                        pledge_frequency: 'Monthly',
                        status: 'Partner - Financial'
                    },
                    monthlyDonations: [
                        {
                            donations: [
                                {
                                    date: '2016-05-19',
                                    amount: '25.0',
                                    currency: {
                                        code: 'NZD',
                                        symbol: '$'
                                    }
                                }
                            ],
                            total: 25,
                            nativeTotal: 25,
                            convertedTotal: 25
                        },
                        { donations: [], total: 0, nativeTotal: 0, convertedTotal: 0 }
                    ],
                    average: 12.5,
                    maximum: 25,
                    minimum: 25,
                    total: 25
                }
            ]
        }
    ],
    years: { '2016': 2 },
    months: ['2016-05-01', '2016-06-01'],
    total: 25,
    salaryCurrency: {
        code: 'NZD',
        code_symbol_string: 'NZD ($)',
        name: 'New Zealand dollar',
        symbol: '$'
    }
};

const csvData = [
    ['Currency', 'NZD', '$'],
    [
        'Partner', 'Status', 'Pledge', 'Average', 'Minimum', 'Maximum', 'May 16',
        'Jun 16', 'Total (last month excluded from total)'
    ],
    ['Abraham, Adam', 'Never Contacted', '$25.0 NZD ', 13, 25, 25, 25, 0, 25],
    ['Smith, Sarah', 'Partner - Financial', '$25.0 NZD Monthly', 13, 25, 25, 25, 0, 25],
    ['Totals', '', '', 20, 1, 30, 50, 0, 25]
];

describe('reports.contributions.component', () => {
    let $ctrl, rootScope, scope, serverConstants, componentController, api, designationAccounts, gettextCatalog, q;
    beforeEach(() => {
        angular.mock.module(component);
        inject((
            $componentController, $rootScope, _serverConstants_, _api_, _designationAccounts_, _gettextCatalog_, $q
        ) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            api = _api_;
            designationAccounts = _designationAccounts_;
            serverConstants = _serverConstants_;
            gettextCatalog = _gettextCatalog_;
            q = $q;
            componentController = $componentController;
            api.account_list_id = 123;

            serverConstants.data = {
                pledge_frequency_hashes: [{
                    'id': 'Weekly',
                    'key': '0.23076923076923',
                    'value': 'Weekly'
                }, {
                    'id': 'Every 2 Weeks',
                    'key': '0.46153846153846',
                    'value': 'Every 2 Weeks'
                }, {
                    'id': 'Monthly',
                    'key': 1,
                    'value': 'Monthly'
                }, {
                    'id': 'Every 2 Months',
                    'key': 2,
                    'value': 'Every 2 Months'
                }, {
                    'id': 'Quarterly',
                    'key': 3,
                    'value': 'Quarterly'
                }, {
                    'id': 'Every 4 Months',
                    'key': 4,
                    'value': 'Every 4 Months'
                }, {
                    'id': 'Every 6 Months',
                    'key': 6,
                    'value': 'Every 6 Months'
                }, {
                    'id': 'Annual',
                    'key': 12.0,
                    'value': 'Annual'
                }, {
                    'id': 'Every 2 Years',
                    'key': 24.0,
                    'value': 'Every 2 Years'
                }],
                pledge_currencies: {
                    nzd: {
                        code: 'NZD',
                        code_symbol_string: 'NZD ($)',
                        name: 'New Zealand dollar',
                        symbol: '$'
                    }
                }
            };
            $ctrl = componentController('contributions', { $scope: scope }, {});
        });
    });

    describe('constructor', () => {
        it('should set default values', () => {
            expect($ctrl.data).toEqual({});
            expect($ctrl.expanded).toBeFalsy();
            expect($ctrl.loading).toBeFalsy();
            expect($ctrl.sort).toEqual('contact.contact_name');
            expect($ctrl.sortReverse).toBeFalsy();
        });
    });

    describe('$onInit', () => {
        beforeEach(() => {
            spyOn($ctrl, 'load').and.callFake(() => q.resolve());
        });

        afterEach(() => {
            $ctrl.$onDestroy();
        });

        it('should call load', () => {
            $ctrl.$onInit();
            expect($ctrl.load).toHaveBeenCalled();
        });
    });

    describe('$onDestroy', () => {
        it('should clear watchers', () => {
            $ctrl.$onInit();
            spyOn($ctrl, 'watcher').and.callFake(() => {});
            spyOn($ctrl, 'watcher2').and.callFake(() => {});
            $ctrl.$onDestroy();
            expect($ctrl.watcher).toHaveBeenCalled();
            expect($ctrl.watcher2).toHaveBeenCalled();
        });
    });

    describe('$onInit', () => {
        describe('events', () => {
            beforeEach(() => {
                $ctrl.$onInit();
                spyOn($ctrl, 'load').and.callFake((data) => q.resolve(data));
            });

            it('will reload on accountListUpdated', () => {
                rootScope.$emit('accountListUpdated');
                expect($ctrl.load).toHaveBeenCalled();
            });

            it('will reload on designationAccountSelectorChanged', () => {
                rootScope.$emit('designationAccountSelectorChanged');
                expect($ctrl.load).toHaveBeenCalled();
            });
        });
    });

    describe('load', () => {
        const data = { salary_currency: 'NZD', months: ['2016-07-01', '2016-08-01'] };

        beforeEach(() => {
            spyOn(api, 'get').and.callFake(() => q.resolve(data));
            spyOn($ctrl, 'getCurrencies').and.callFake(() => []);
            spyOn($ctrl, 'buildYears').and.callFake(() => { return { a: 'b' }; });
        });

        describe('type = salary', () => {
            beforeEach(() => {
                $ctrl.type = 'salary';
            });

            it('should call api', () => {
                $ctrl.load();
                expect(api.get).toHaveBeenCalledWith(
                    'reports/salary_currency_donations',
                    { filter: { account_list_id: api.account_list_id } }
                );
            });

            it('should get currencies', (done) => {
                $ctrl.load().then(() => {
                    expect($ctrl.getCurrencies).toHaveBeenCalledWith('salary', data);
                    done();
                });
                scope.$digest();
            });

            it('should build years', (done) => {
                $ctrl.load().then(() => {
                    expect($ctrl.buildYears).toHaveBeenCalledWith(data.months);
                    done();
                });
                scope.$digest();
            });

            it('should set data', (done) => {
                $ctrl.load().then(() => {
                    expect($ctrl.data).toEqual({
                        currencies: [],
                        years: { a: 'b' },
                        months: data.months,
                        total: 0,
                        salaryCurrency: serverConstants.data.pledge_currencies['nzd']
                    });
                    done();
                });
                scope.$digest();
            });

            it('should set loading to false', (done) => {
                $ctrl.load().then(() => {
                    expect($ctrl.loading).toBeFalsy();
                    done();
                });
                scope.$digest();
            });
        });

        describe('type = partner', () => {
            beforeEach(() => {
                $ctrl.type = 'partner';
            });

            it('should call api', () => {
                $ctrl.load();
                expect(api.get).toHaveBeenCalledWith(
                    'reports/donor_currency_donations',
                    { filter: { account_list_id: api.account_list_id } }
                );
            });

            it('should return a promise', () => {
                expect($ctrl.load()).toEqual(jasmine.any(q));
            });

            describe('selected designationAccounts', () => {
                beforeEach(() => {
                    designationAccounts.selected = ['abc', 'def'];
                });

                it('should call api with filter params', () => {
                    $ctrl.load();
                    expect(api.get).toHaveBeenCalledWith(
                        'reports/donor_currency_donations',
                        {
                            filter: {
                                account_list_id: api.account_list_id,
                                designation_account_id: 'abc,def'
                            }
                        }
                    );
                });
            });
        });
    });

    describe('buildYears', () => {
        it('should build an object of years', () => {
            expect($ctrl.buildYears(['2016-07-01', '2016-08-01'])).toEqual({ 2016: 2 });
        });
    });

    describe('getSortedCurrencies', () => {
        const data = [
            { totals: { year_converted: '67086.99546423639162522026817265' } },
            { totals: { year_converted: '67087.99546423639162522026817265' } }
        ];

        beforeEach(() => {
            spyOn($ctrl, 'getCurrencies').and.callFake(() => data);
        });

        it('should sort Currencies', () => {
            expect($ctrl.getSortedCurrencies('salary', data)).toEqual([
                { totals: { year_converted: '67087.99546423639162522026817265' } },
                { totals: { year_converted: '67086.99546423639162522026817265' } }
            ]);
        });
    });

    describe('getCurrencies', () => {
        const data = { currency_groups: { nzd: [] }, totals: { year_converted: '67086.99546423639162522026817265' } };

        beforeEach(() => {
            spyOn($ctrl, 'getDonors').and.callFake(() => ['a']);
            spyOn($ctrl, 'getDonorTotals').and.callFake(() => ['b']);
        });

        it('should create an array of currencies', () => {
            expect($ctrl.getCurrencies('salary', data)).toEqual([assign(serverConstants.data.pledge_currencies['nzd'], {
                totals: ['b'],
                donors: ['a']
            })]);
        });
    });

    describe('getDonorTotals', () => {
        const value = { totals: { totes: {} } };
        const data = [{
            monthlyDonations: [
                { total: 100, convertedTotal: 1 },
                { total: 200, convertedTotal: 2 },
                { total: 400, convertedTotal: 4 }
            ],
            average: '20',
            minimum: '1',
            maximum: '30'
        }, {
            monthlyDonations: [
                { total: 100, convertedTotal: 1 },
                { total: 200, convertedTotal: 2 },
                { total: 400, convertedTotal: 4 }
            ],
            average: '20',
            minimum: '1',
            maximum: '30'
        }, {
            monthlyDonations: [
                { total: 100, convertedTotal: 1 },
                { total: 200, convertedTotal: 2 },
                { total: 400, convertedTotal: 4 }
            ],
            average: '20',
            minimum: '1',
            maximum: '30'
        }];
        const months = times(constant(0), 3);

        it('should add converted Totals and re-arrange object values', () => {
            expect($ctrl.getDonorTotals(value, data, months)).toEqual({
                totes: {},
                months: [300, 600, 1200],
                convertedMonths: [3, 6, 12],
                average: 60,
                minimum: 3,
                maximum: 90
            });
        });
    });

    describe('getDonors', () => {
        const data = {
            donor_infos: [{ contact_id: 2, contact_name: 'a, b' }, { contact_id: 1, contact_name: 'b, c' }]
        };
        const info = [
            { contact_id: 1, total: 1, average: 2, maximum: 3, minimum: 0 },
            { contact_id: 2, total: 2, average: 3, maximum: 4, minimum: 1 },
            { contact_id: 3, total: null, average: 4, maximum: 5, minimum: 2 }
        ];

        beforeEach(() => {
            spyOn($ctrl, 'getMonthlyDonations').and.callFake(() => ['a']);
            spyOn($ctrl, 'getCurrency').and.callFake(() => ({ symbol: '$' }));
        });

        it('should create a sorted array of donors', () => {
            expect($ctrl.getDonors(data, 'salary', info)).toEqual([
                {
                    contact: {
                        contact_id: 2,
                        contact_name: 'a, b',
                        pledge_amount: 0,
                        pledge_currency_symbol: '$'
                    },
                    total: 2,
                    average: 3,
                    maximum: 4,
                    minimum: 1,
                    monthlyDonations: ['a']
                },
                {
                    contact: { contact_id: 1,
                        contact_name: 'b, c',
                        pledge_amount: 0,
                        pledge_currency_symbol: '$'
                    },
                    total: 1,
                    average: 2,
                    maximum: 3,
                    minimum: 0,
                    monthlyDonations: ['a']
                }
            ]);
        });
    });

    describe('getMonthlyDonations', () => {
        const donor = {
            months: [
                { donations: [{ amount: '1', converted_amount: 1.1 }, { amount: 1, converted_amount: 2.2 }] },
                { donations: [{ amount: 2, converted_amount: 2.2 }, { amount: 2, converted_amount: 3.3 }] }
            ]
        };

        it('should add converted Totals and re-arrange object values', () => {
            expect($ctrl.getMonthlyDonations('salary', donor)).toEqual([
                {
                    donations: [{ amount: '1', converted_amount: 1.1 }, { amount: 1, converted_amount: 2.2 }],
                    total: 3,
                    convertedTotal: 3,
                    nativeTotal: 2
                },
                {
                    donations: [{ amount: 2, converted_amount: 2.2 }, { amount: 2, converted_amount: 3.3 }],
                    total: 5,
                    convertedTotal: 5,
                    nativeTotal: 4
                }
            ]);
        });

        it('should add converted Totals and re-arrange object values for partner', () => {
            expect($ctrl.getMonthlyDonations('partner', donor)).toEqual([
                {
                    donations: [{ amount: '1', converted_amount: 1.1 }, { amount: 1, converted_amount: 2.2 }],
                    total: 2,
                    convertedTotal: 3,
                    nativeTotal: 2
                },
                {
                    donations: [{ amount: 2, converted_amount: 2.2 }, { amount: 2, converted_amount: 3.3 }],
                    total: 4,
                    convertedTotal: 5,
                    nativeTotal: 4
                }
            ]);
        });
    });

    describe('toCSVAfterServerConstants', () => {
        let data;

        describe('contributions not set', () => {
            beforeEach(() => {
                data = null;
            });

            it('should return empty array', () => {
                expect($ctrl.toCSVAfterServerConstants(data)).toEqual([]);
            });
        });

        describe('contributions.data.currencies not set', () => {
            beforeEach(() => {
                data = { currencies: null };
            });

            it('should return empty array', () => {
                expect($ctrl.toCSVAfterServerConstants(data)).toEqual([]);
            });
        });

        describe('contributions.data.months not set', () => {
            beforeEach(() => {
                data = { months: null };
            });

            it('should return empty array', () => {
                expect($ctrl.toCSVAfterServerConstants(data)).toEqual([]);
            });
        });

        describe('contributions.data set', () => {
            it('should get headers from gettextCatalog', () => {
                spyOn(gettextCatalog, 'getString').and.callThrough();
                $ctrl.toCSVAfterServerConstants(loadData);
                expect(gettextCatalog.getString).toHaveBeenCalledWith('Partner');
                expect(gettextCatalog.getString).toHaveBeenCalledWith('Status');
                expect(gettextCatalog.getString).toHaveBeenCalledWith('Pledge');
                expect(gettextCatalog.getString).toHaveBeenCalledWith('Average');
                expect(gettextCatalog.getString).toHaveBeenCalledWith('Minimum');
                expect(gettextCatalog.getString).toHaveBeenCalledWith('Maximum');
            });

            it('should return array for CSV', () => {
                expect($ctrl.toCSVAfterServerConstants(loadData)).toEqual(csvData);
            });
        });
    });

    describe('percentage', () => {
        describe('total set > 0', () => {
            beforeEach(() => {
                $ctrl.data = { total: 150 };
            });

            describe('amount 0', () => {
                it('should return 0', () => {
                    expect($ctrl.percentage(0)).toEqual(0);
                });
            });

            describe('amount is divisible total', () => {
                it('should return amount / total * 100', () => {
                    expect($ctrl.percentage(125)).toEqual(125 / 150 * 100);
                });
            });
        });

        describe('total set === 0', () => {
            beforeEach(() => {
                $ctrl.data = { total: 0 };
            });

            describe('amount 0', () => {
                it('should return NaN', () => {
                    expect($ctrl.percentage(0)).toEqual(NaN);
                });
            });

            describe('amount is infinitely divisble by total', () => {
                it('should return amount / total * 100', () => {
                    expect($ctrl.percentage(125)).toEqual(NaN);
                });
            });
        });

        describe('total not set', () => {
            beforeEach(() => {
                $ctrl.data = { total: null };
            });

            describe('amount 0', () => {
                it('should return NaN', () => {
                    expect($ctrl.percentage(0)).toEqual(NaN);
                });
            });

            describe('amount is infinitely divisble by total', () => {
                it('should return amount / total * 100', () => {
                    expect($ctrl.percentage(125)).toEqual(NaN);
                });
            });
        });

        describe('contributions not set', () => {
            describe('amount 0', () => {
                it('should return NaN', () => {
                    expect($ctrl.percentage(0)).toEqual(NaN);
                });
            });
        });
    });

    describe('toCSV', () => {
        it('should return an array', () => {
            expect($ctrl.toCSV({})).toEqual(jasmine.any(Array));
        });

        describe('promise successful', () => {
            it('should format return object', (done) => {
                spyOn($ctrl, 'toCSVAfterServerConstants').and.callFake(() => q.resolve());
                $ctrl.toCSV({}).then(() => {
                    expect($ctrl.toCSVAfterServerConstants).toHaveBeenCalledWith({});
                    done();
                });
                scope.$digest();
            });
        });
    });

    describe('moment', () => {
        it('should return a moment object', () => {
            expect(moment.isMoment($ctrl.moment('05-12-2017'))).toBeTruthy();
        });
    });

    describe('changeSort', () => {
        beforeEach(() => {
            $ctrl.sort = 'a';
            $ctrl.sortReverse = true;
        });

        it('should change sort', () => {
            $ctrl.changeSort('b');
            expect($ctrl.sort).toEqual('b');
            expect($ctrl.sortReverse).toBeFalsy();
        });

        it('should reverse sort', () => {
            $ctrl.changeSort('a');
            expect($ctrl.sort).toEqual('a');
            expect($ctrl.sortReverse).toBeFalsy();
        });
    });

    describe('getCurrency', () => {
        it('should return the currency requested', () => {
            serverConstants.data = {
                pledge_currencies: {
                    nzd: {
                        code: 'NZD',
                        code_symbol_string: 'NZD ($)',
                        name: 'New Zealand dollar',
                        symbol: '$'
                    }
                }
            };
            expect($ctrl.getCurrency('NZD')).toEqual(serverConstants.data.pledge_currencies.nzd);
        });

        it('should handle null', () => {
            expect($ctrl.getCurrency()).toEqual(undefined);
        });
    });
});
