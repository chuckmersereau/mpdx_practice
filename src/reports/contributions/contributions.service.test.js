import service from './contributions.service';

describe('reports.contributions.service', () => {
    let gettextCatalog, api, serverConstants, contributions;

    beforeEach(() => {
        angular.mock.module(service);
        inject((_gettextCatalog_, _api_, _serverConstants_, _contributions_) => {
            gettextCatalog = _gettextCatalog_;
            api = _api_;
            serverConstants = _serverConstants_;
            contributions = _contributions_;
            api.account_list_id = 123;

            serverConstants.data = {
                pledge_frequencies: {
                    0.23076923076923: "Every Week",
                    0.46153846153846: "Every 2 Weeks",
                    1: "Every Month",
                    2: "Every 2 Months",
                    3: "Every Quarter",
                    4: "Every 4 Months",
                    6: "Every 6 Months",
                    12: "Every Year",
                    24: "Every 2 Years"
                },
                pledge_currencies: {
                    nzd: {
                        code: "NZD",
                        code_symbol_string: "NZD ($)",
                        name: "New Zealand dollar",
                        symbol: "$"
                    }
                }
            };
        });
    });

    describe('load', () => {
        beforeEach(() => {
            spyOn(serverConstants, 'load').and.callFake(() => Promise.resolve());
        });

        it('should call serverConstants', () => {
            contributions.load('salary');
            expect(serverConstants.load).toHaveBeenCalled();
        });

        it('should return a promise', () => {
            expect(contributions.load('salary')).toEqual(jasmine.any(Promise));
        });

        describe('promise successful', () => {
            it('should format return object', (done) => {
                spyOn(contributions, 'loadAfterServerConstants').and.callFake(() => Promise.resolve());
                contributions.load('salary').then(() => {
                    expect(contributions.loadAfterServerConstants).toHaveBeenCalledWith('salary');
                    done();
                });
            });
        });
    });

    describe('toCSV', () => {
        beforeEach(() => {
            spyOn(serverConstants, 'load').and.callFake(() => Promise.resolve());
        });

        it('should call serverConstants', () => {
            contributions.toCSV({});
            expect(serverConstants.load).toHaveBeenCalled();
        });

        it('should return a promise', () => {
            expect(contributions.toCSV({})).toEqual(jasmine.any(Promise));
        });

        describe('promise successful', () => {
            it('should format return object', (done) => {
                spyOn(contributions, 'toCSVAfterServerConstants').and.callFake(() => Promise.resolve());
                contributions.toCSV({}).then(() => {
                    expect(contributions.toCSVAfterServerConstants).toHaveBeenCalledWith({});
                    done();
                });
            });
        });
    });

    describe('loadAfterServerConstants', () => {
        describe('type = salary', () => {
            beforeEach(() => {
                spyOn(api, 'get').and.callFake(() => Promise.resolve());
            });

            it('should call api', () => {
                contributions.loadAfterServerConstants('salary');
                expect(api.get).toHaveBeenCalledWith(
                    'reports/salary_currency_donations',
                    { filter: { account_list_id: api.account_list_id } }
                );
            });

            it('should return a promise', () => {
                expect(contributions.loadAfterServerConstants('salary')).toEqual(jasmine.any(Promise));
            });
        });

        describe('type = partner', () => {
            beforeEach(() => {
                spyOn(api, 'get').and.callFake(() => Promise.resolve());
            });

            it('should call api', () => {
                contributions.loadAfterServerConstants('partner');
                expect(api.get).toHaveBeenCalledWith(
                    'reports/donor_currency_donations',
                    { filter: { account_list_id: api.account_list_id } }
                );
            });

            it('should return a promise', () => {
                expect(contributions.loadAfterServerConstants('partner')).toEqual(jasmine.any(Promise));
            });
        });

        describe('promise successful', () => {
            it('should format return object', (done) => {
                spyOn(api, 'get').and.callFake(() => Promise.resolve(apiData));
                contributions.loadAfterServerConstants('salary').then((data) => {
                    expect(data).toEqual(loadData);
                    done();
                });
            });
        });
    });


    describe('toCSVAfterServerConstants', () => {
        let data;

        describe('contributions not set', () => {
            beforeEach(() => {
                data = null;
            });

            it('should return empty array', () => {
                expect(contributions.toCSVAfterServerConstants(data)).toEqual([]);
            });
        });

        describe('contributions.data.currencies not set', () => {
            beforeEach(() => {
                data = { currencies: null };
            });

            it('should return empty array', () => {
                expect(contributions.toCSVAfterServerConstants(data)).toEqual([]);
            });
        });

        describe('contributions.data.months not set', () => {
            beforeEach(() => {
                data = { months: null };
            });

            it('should return empty array', () => {
                expect(contributions.toCSVAfterServerConstants(data)).toEqual([]);
            });
        });

        describe('contributions.data set', () => {
            it('should get headers from gettextCatalog', () => {
                spyOn(gettextCatalog, 'getString').and.callThrough();
                contributions.toCSVAfterServerConstants(loadData);
                expect(gettextCatalog.getString).toHaveBeenCalledWith('Partner');
                expect(gettextCatalog.getString).toHaveBeenCalledWith('Status');
                expect(gettextCatalog.getString).toHaveBeenCalledWith('Pledge');
                expect(gettextCatalog.getString).toHaveBeenCalledWith('Average');
                expect(gettextCatalog.getString).toHaveBeenCalledWith('Minimum');
                expect(gettextCatalog.getString).toHaveBeenCalledWith('Maximum');
            });

            it('should return array for CSV', () => {
                expect(contributions.toCSVAfterServerConstants(loadData)).toEqual(csvData);
            });
        });
    });

    const apiData = {
        currency_groups: {
            nzd: {
                totals: {
                    year: '25.0',
                    year_converted: 25,
                    months: ['25.0', 0]
                },
                donation_infos: [
                    {
                        contact_id: 'contact_id_1',
                        total: 25,
                        average: 12.5,
                        minimum: 25,
                        maximum: 25,
                        months: [
                            {
                                total: '25.0',
                                donations: [
                                    {
                                        amount: '25.0',
                                        contact_id: 'contact_id_1',
                                        contact_name: 'Smith, Sarah',
                                        converted_amount: 25,
                                        converted_currency: 'NZD',
                                        currency: 'NZD',
                                        donation_date: '2016-05-19',
                                        donation_id: 'donation_id_1',
                                        likelihood_type: 'received'
                                    }
                                ]
                            },
                            { total: 0, donations: [] }
                        ]
                    }, {
                        contact_id: 'contact_id_2',
                        total: 25,
                        average: 12.5,
                        minimum: 25,
                        maximum: 25,
                        months: [
                            {
                                total: '25.0',
                                donations: [
                                    {
                                        amount: '25.0',
                                        contact_id: 'contact_id_2',
                                        contact_name: 'Abraham, Adam',
                                        converted_amount: 25,
                                        converted_currency: 'NZD',
                                        currency: 'NZD',
                                        donation_date: '2016-05-19',
                                        donation_id: 'donation_id_2',
                                        likelihood_type: 'received'
                                    }
                                ]
                            },
                                { total: 0, donations: [] }
                        ]
                    }
                ]
            }
        },
        donor_infos: [
            {
                contact_id: 'contact_id_1',
                contact_name: 'Smith, Sarah',
                late_by_30_days: false,
                late_by_60_days: false,
                pledge_amount: '25.0',
                pledge_currency: 'NZD',
                pledge_frequency: 1,
                status: 'Partner - Financial'
            }, {
                contact_id: 'contact_id_2',
                contact_name: 'Abraham, Adam',
                late_by_30_days: false,
                late_by_60_days: false,
                pledge_amount: '25.0',
                pledge_currency: 'NZD',
                pledge_frequency: null,
                status: 'Never Contacted'
            }
        ],
        months: ['2016-05-01', '2016-06-01'],
        salary_currency: 'NZD'
    };

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
                    months: ['25.0', 0]
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
                            pledge_frequency: 1,
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
        ['Smith, Sarah', 'Partner - Financial', '$25.0 NZD Every Month', 13, 25, 25, 25, 0, 25],
        ['Totals', '', '', '', '', '', '25.0', 0, 25]
    ];
});
