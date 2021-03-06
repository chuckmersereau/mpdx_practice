import * as moment from 'moment';
import component from './chart.component';

const data = {
    monthly_average: 6254,
    monthly_goal: 200,
    months_to_dates: [
        '2017-04-01T00:00:00+00:00',
        '2017-05-01T00:00:00+00:00',
        '2017-06-01T00:00:00+00:00',
        '2017-07-01T00:00:00+00:00'
    ],
    pledges: 500,
    display_currency: 'CAD',
    totals: [
        {
            currency: 'CAD',
            total_amount: '81244.65',
            total_converted: 81244.65,
            month_totals: [
                {
                    amount: '5860.78',
                    converted: 5860.78
                },
                {
                    amount: '7235.78',
                    converted: 7235.78
                },
                {
                    amount: '6206.12',
                    converted: 6206.12
                },
                {
                    amount: '5855.75',
                    converted: 5855.75
                }
            ]
        },
        {
            currency: 'USD',
            total_amount: '50.0',
            total_converted: '64.79085',
            month_totals: [
                {
                    amount: '0.0',
                    converted: '0.0'
                },
                {
                    amount: '0.0',
                    converted: '0.0'
                },
                {
                    amount: '25.0',
                    converted: '33.18825'
                },
                {
                    amount: '25.0',
                    converted: '31.6026'
                }
            ]
        }
    ]
};

const inContactData = {
    monthly_average: 136,
    months_to_dates: [
        '2015-08-01T00:00:00+00:00',
        '2015-09-01T00:00:00+00:00',
        '2015-10-01T00:00:00+00:00',
        '2015-11-01T00:00:00+00:00',
        '2015-12-01T00:00:00+00:00',
        '2016-01-01T00:00:00+00:00',
        '2016-02-01T00:00:00+00:00',
        '2016-03-01T00:00:00+00:00',
        '2016-04-01T00:00:00+00:00',
        '2016-05-01T00:00:00+00:00',
        '2016-06-01T00:00:00+00:00',
        '2016-07-01T00:00:00+00:00',
        '2016-08-01T00:00:00+00:00',
        '2016-09-01T00:00:00+00:00',
        '2016-10-01T00:00:00+00:00',
        '2016-11-01T00:00:00+00:00',
        '2016-12-01T00:00:00+00:00',
        '2017-01-01T00:00:00+00:00',
        '2017-02-01T00:00:00+00:00',
        '2017-03-01T00:00:00+00:00',
        '2017-04-01T00:00:00+00:00',
        '2017-05-01T00:00:00+00:00',
        '2017-06-01T00:00:00+00:00',
        '2017-07-01T00:00:00+00:00'
    ],
    display_currency: 'CAD',
    totals: [
        {
            currency: 'CAD',
            total_amount: '3268.79',
            total_converted: 3268.790000000001,
            month_totals: [
                {
                    amount: '100.0',
                    converted: 100
                },
                {
                    amount: '100.0',
                    converted: 100
                },
                {
                    amount: '100.0',
                    converted: 100
                },
                {
                    amount: '100.0',
                    converted: 100
                },
                {
                    amount: '100.0',
                    converted: 100
                },
                {
                    amount: '100.0',
                    converted: 100
                },
                {
                    amount: '315.0',
                    converted: 315
                },
                {
                    amount: '134.42',
                    converted: 134.42
                },
                {
                    amount: '134.42',
                    converted: 134.42
                },
                {
                    amount: '133.0',
                    converted: 133
                },
                {
                    amount: '132.11',
                    converted: 132.11
                },
                {
                    amount: '132.11',
                    converted: 132.11
                },
                {
                    amount: '264.22',
                    converted: 264.22
                },
                {
                    amount: '134.76',
                    converted: 134.76
                },
                {
                    amount: '134.32',
                    converted: 134.32
                },
                {
                    amount: '137.06',
                    converted: 137.06
                },
                {
                    amount: '129.65',
                    converted: 129.65
                },
                {
                    amount: '130.1',
                    converted: 130.1
                },
                {
                    amount: '129.99',
                    converted: 129.99
                },
                {
                    amount: '133.61',
                    converted: 133.61
                },
                {
                    amount: '129.99',
                    converted: 129.99
                },
                {
                    amount: '129.99',
                    converted: 129.99
                },
                {
                    amount: '100.0',
                    converted: 100
                },
                {
                    amount: '134.04',
                    converted: 134.04
                }
            ]
        }
    ]
};

describe('reports.donations.chart.component', () => {
    let $ctrl, scope, rootScope, api, designationAccounts, q;

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _api_, _designationAccounts_, $q) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            api = _api_;
            designationAccounts = _designationAccounts_;
            q = $q;
            $ctrl = $componentController('donationsChart', { $scope: scope }, { inContact: false });
        });
    });

    describe('$onInit', () => {
        afterEach(() => {
            $ctrl.$onDestroy();
        });

        describe('events', () => {
            beforeEach(() => {
                $ctrl.$onInit();
            });

            it('should watch accountListUpdated', () => {
                spyOn($ctrl, 'load').and.callFake(() => {
                });
                rootScope.$emit('accountListUpdated');
                expect($ctrl.load).toHaveBeenCalledWith();
            });

            it('should watch donationUpdated', () => {
                spyOn($ctrl, 'load').and.callFake(() => {
                });
                rootScope.$emit('donationUpdated');
                expect($ctrl.load).toHaveBeenCalledWith();
            });

            it('should watch designationAccountSelectorChanged', () => {
                spyOn($ctrl, 'load').and.callFake(() => {
                });
                rootScope.$emit('designationAccountSelectorChanged');
                expect($ctrl.load).toHaveBeenCalledWith();
            });
        });
    });

    describe('$onChanges', () => {
        it('should handle donation updated', () => {
            spyOn($ctrl, 'load').and.callFake(() => {
            });
            $ctrl.$onChanges();
            expect($ctrl.load).toHaveBeenCalledWith();
        });
    });

    describe('$onDestroy', () => {
        beforeEach(() => {
            $ctrl.$onInit();
        });

        it('should cancel watchers', () => {
            spyOn($ctrl, 'watcher').and.callThrough();
            spyOn($ctrl, 'watcher2').and.callThrough();
            spyOn($ctrl, 'watcher3').and.callThrough();
            $ctrl.$onDestroy();
            expect($ctrl.watcher).toHaveBeenCalledWith();
            expect($ctrl.watcher2).toHaveBeenCalledWith();
            expect($ctrl.watcher3).toHaveBeenCalledWith();
        });
    });

    describe('load', () => {
        let spy;
        const mutatedValues = 'mutatedValues';

        beforeEach(() => {
            spy = spyOn($ctrl, 'getDonationChart').and.callFake(() => q.resolve(data));
            spyOn($ctrl, 'mutateUnconverted').and.callFake(() => 'mutatedValues');
        });

        it('should set startDate to 12 months ago', () => {
            $ctrl.load();
            expect($ctrl.startDate).toEqual(moment().startOf('month').subtract(12, 'months'));
        });

        it('should set endDate to end of month', () => {
            $ctrl.load();
            expect($ctrl.endDate).toEqual(moment().endOf('month'));
        });

        it('should set loading to true', () => {
            $ctrl.loading = false;
            $ctrl.load();
            expect($ctrl.loading).toEqual(true);
        });

        it('should call $ctrl.getDonationChart with params', () => {
            $ctrl.load();
            expect($ctrl.getDonationChart).toHaveBeenCalledWith({
                startDate: moment().startOf('month').subtract(12, 'months'),
                endDate: moment().endOf('month')
            });
        });

        describe('selected designationAccounts', () => {
            beforeEach(() => {
                designationAccounts.selected = ['abc', 'def'];
            });

            it('should call $ctrl.getDonationChart with params', () => {
                $ctrl.load();
                expect($ctrl.getDonationChart).toHaveBeenCalledWith({
                    startDate: moment().startOf('month').subtract(12, 'months'),
                    endDate: moment().endOf('month'),
                    designationAccountId: 'abc,def'
                });
            });
        });

        describe('promise successful', () => {
            it('should set $ctrl.options', (done) => {
                $ctrl.load().then(() => {
                    expect($ctrl.options).toEqual({
                        responsive: true,
                        maintainAspectRatio: false,
                        legend: {
                            display: true
                        },
                        scales: {
                            xAxes: [{
                                stacked: true,
                                gridLines: {
                                    display: false
                                },
                                barThickness: 40
                            }],
                            yAxes: [{
                                stacked: true,
                                ticks: {
                                    beginAtZero: true
                                },
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Amount (CAD)'
                                }
                            }]
                        },
                        annotation: {
                            annotations: [{
                                type: 'line',
                                mode: 'horizontal',
                                scaleID: 'y-axis-0',
                                value: 6254,
                                borderColor: '#666062',
                                borderWidth: 2
                            }, {
                                type: 'line',
                                mode: 'horizontal',
                                scaleID: 'y-axis-0',
                                value: 500,
                                borderColor: '#007398',
                                borderWidth: 2
                            }, {
                                type: 'line',
                                mode: 'horizontal',
                                scaleID: 'y-axis-0',
                                value: 200,
                                borderColor: '#3eb1c8',
                                borderWidth: 2
                            }],
                            drawTime: 'beforeDatasetsDraw'
                        },
                        onClick: jasmine.any(Function),
                        tooltips: {
                            callbacks: {
                                label: jasmine.any(Function)
                            }
                        }
                    });
                    done();
                });
                rootScope.$digest();
            });

            it('should set $ctrl.labels', (done) => {
                $ctrl.load().then(() => {
                    expect($ctrl.labels).toEqual(['Apr 17', 'May 17', 'Jun 17', 'Jul 17']);
                    done();
                });
                rootScope.$digest();
            });

            it('should set $ctrl.series', (done) => {
                $ctrl.load().then(() => {
                    expect($ctrl.series).toEqual(['CAD', 'USD']);
                    done();
                });
                rootScope.$digest();
            });

            it('should set $ctrl.data', (done) => {
                $ctrl.load().then(() => {
                    expect($ctrl.data).toEqual([[5861, 7236, 6206, 5856], [0, 0, 33, 32]]);
                    done();
                });
                rootScope.$digest();
            });

            it('should set $ctrl.chartData', (done) => {
                $ctrl.load().then(() => {
                    expect($ctrl.chartData).toEqual(data);
                    done();
                });
                rootScope.$digest();
            });

            it('should set loading to false', (done) => {
                $ctrl.loading = true;
                $ctrl.load().then(() => {
                    expect($ctrl.loading).toEqual(false);
                    done();
                });
                rootScope.$digest();
            });

            it('should set mutate unconverted values', (done) => {
                $ctrl.load().then(() => {
                    expect($ctrl.unConvertedData).toEqual(mutatedValues);
                    done();
                });
                rootScope.$digest();
            });
        });

        describe('inContact', () => {
            beforeEach(() => {
                $ctrl.inContact = true;
                $ctrl.contacts = {
                    current: {
                        donor_accounts: [
                            { id: 123 }
                        ],
                        pledge_currency: 'USD'
                    }
                };
            });

            it('should set startDate to 23 months ago', () => {
                $ctrl.load();
                expect($ctrl.startDate).toEqual(moment().startOf('month').subtract(23, 'months'));
            });

            it('should return promise', () => {
                expect($ctrl.load()).toEqual(jasmine.any(q));
            });

            describe('promise successful', () => {
                beforeEach(() => {
                    spy.and.callFake(() => q.resolve(inContactData));
                });

                it('should set $ctrl.options', (done) => {
                    $ctrl.load().then(() => {
                        expect($ctrl.options).toEqual({
                            responsive: true,
                            maintainAspectRatio: false,
                            legend: {
                                display: true
                            },
                            scales: {
                                xAxes: [{
                                    stacked: false,
                                    gridLines: {
                                        display: false
                                    },
                                    barThickness: 20
                                }],
                                yAxes: [{
                                    stacked: false,
                                    ticks: {
                                        beginAtZero: true
                                    },
                                    scaleLabel: {
                                        display: true,
                                        labelString: 'Amount (CAD)'
                                    }
                                }]
                            },
                            annotation: {
                                annotations: [{
                                    type: 'line',
                                    mode: 'horizontal',
                                    scaleID: 'y-axis-0',
                                    value: 136,
                                    borderColor: '#666062',
                                    borderWidth: 2
                                }],
                                drawTime: 'beforeDatasetsDraw'
                            },
                            onClick: jasmine.any(Function)
                        });
                        done();
                    });
                    rootScope.$digest();
                });

                it('should set $ctrl.labels', (done) => {
                    $ctrl.load().then(() => {
                        expect($ctrl.labels).toEqual(
                            ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
                        );
                        done();
                    });
                    rootScope.$digest();
                });

                it('should set $ctrl.series', (done) => {
                    $ctrl.load().then(() => {
                        expect($ctrl.series).toEqual(
                            ['Last Year', 'This Year']
                        );
                        done();
                    });
                    rootScope.$digest();
                });

                it('should set $ctrl.data', (done) => {
                    $ctrl.load().then(() => {
                        expect($ctrl.data).toEqual([
                            [100, 100, 100, 100, 100, 100, 315, 134, 134, 133, 132, 132],
                            [264, 135, 134, 137, 130, 130, 130, 134, 130, 130, 100, 134]]);
                        done();
                    });
                    rootScope.$digest();
                });

                it('should set $ctrl.chartData', (done) => {
                    $ctrl.load().then(() => {
                        expect($ctrl.chartData).toEqual(inContactData);
                        done();
                    });
                    rootScope.$digest();
                });
            });

            describe('no donor accounts', () => {
                beforeEach(() => {
                    $ctrl.contacts.current.donor_accounts = [];
                });

                it('should return rejected promise', (done) => {
                    $ctrl.load().catch(() => {
                        done();
                    });
                    rootScope.$digest();
                });
            });
        });

        describe('no totals', () => {
            beforeEach(() => {
                spy.and.callFake(() => q.resolve({
                    totals: []
                }));
            });
        });
    });

    describe('getDonationChart', () => {
        beforeEach(() => {
            spyOn(api, 'get').and.callFake((url, data) => q.resolve(data));
        });

        it('should return a promise', () => {
            expect($ctrl.getDonationChart()).toEqual(jasmine.any(q));
        });

        it('should call api.get', () => {
            $ctrl.getDonationChart();
            expect(api.get).toHaveBeenCalledWith(
                'reports/monthly_giving_graph',
                {
                    filter: {
                        account_list_id: api.account_list_id
                    }
                }
            );
        });

        describe('selected designationAccounts', () => {
            let params = {};

            beforeEach(() => {
                params = { designationAccountId: 'abc,def' };
            });

            it('should call $ctrl.getDonationChart with params', () => {
                $ctrl.getDonationChart(params);
                expect(api.get).toHaveBeenCalledWith(
                    'reports/monthly_giving_graph',
                    {
                        filter: {
                            account_list_id: api.account_list_id,
                            designation_account_id: 'abc,def'
                        }
                    }
                );
            });
        });

        describe('date range', () => {
            let params: any = {};

            describe('only startDate set', () => {
                beforeEach(() => {
                    params = { startDate: moment().startOf('month') };
                });

                it('should not set donation_date in params', (done) => {
                    $ctrl.getDonationChart(params).then((data) => {
                        expect(data.filter).toEqual({ account_list_id: api.account_list_id });
                        done();
                    });
                    rootScope.$digest();
                });
            });

            describe('only endDate set', () => {
                beforeEach(() => {
                    params = { endDate: moment().endOf('month') };
                });

                it('should not set donation_date in params', (done) => {
                    $ctrl.getDonationChart(params).then((data) => {
                        expect(data.filter).toEqual({ account_list_id: api.account_list_id });
                        done();
                    });
                    rootScope.$digest();
                });
            });

            describe('both startDate and endDate set', () => {
                describe('both are instances of moment', () => {
                    beforeEach(() => {
                        params = {
                            startDate: moment().startOf('month'),
                            endDate: moment().endOf('month')
                        };
                    });

                    it('should set donation_date range in params', (done) => {
                        $ctrl.getDonationChart(params).then((data) => {
                            expect(data.filter.donation_date).toEqual(
                                `${params.startDate.format('YYYY-MM-DD')}..${params.endDate.format('YYYY-MM-DD')}`
                            );
                            done();
                        });
                        rootScope.$digest();
                    });
                });

                describe('startDate is not instance of moment', () => {
                    beforeEach(() => {
                        params = {
                            startDate: {},
                            endDate: moment().endOf('month')
                        };
                    });

                    it('should not set donation_date in params', (done) => {
                        $ctrl.getDonationChart(params).then((data) => {
                            expect(data.filter).toEqual({ account_list_id: api.account_list_id });
                            done();
                        });
                        rootScope.$digest();
                    });
                });

                describe('endDate is not instance of moment', () => {
                    beforeEach(() => {
                        params = {
                            startDate: moment().startOf('month'),
                            endDate: {}
                        };
                    });

                    it('should not set donation_date in params', (done) => {
                        $ctrl.getDonationChart(params).then((data) => {
                            expect(data.filter).toEqual({ account_list_id: api.account_list_id });
                            done();
                        });
                        rootScope.$digest();
                    });
                });
            });
        });

        describe('donorAccountId', () => {
            const params = { donorAccountId: 'donor_account_id' };

            it('should set donorAccountId in params', (done) => {
                $ctrl.getDonationChart(params).then((data) => {
                    expect(data.filter.donor_account_id).toEqual(params.donorAccountId);
                    done();
                });
                rootScope.$digest();
            });
        });

        describe('displayCurrency', () => {
            const params = { displayCurrency: 'USD' };

            it('should set displayCurrency in params', (done) => {
                $ctrl.getDonationChart(params).then((data) => {
                    expect(data.filter.display_currency).toEqual(params.displayCurrency);
                    done();
                });
                rootScope.$digest();
            });
        });
    });

    describe('generateTooltip', () => {
        let tooltip;
        let data;
        beforeEach(() => {
            tooltip = {
                index: 1,
                datasetIndex: 1
            };
            data = {
                datasets: [{ label: 'USD' }, { label: 'NZD' }]
            };
            $ctrl.unConvertedData = [[0, 1], [2, 3]];
        });

        it('should return undefined if empty', () => {
            tooltip.index = 0;
            tooltip.datasetIndex = 0;
            expect($ctrl.generateTooltip(tooltip, data)).toBeUndefined();
        });

        it('should display value with label', () => {
            expect($ctrl.generateTooltip(tooltip, data)).toEqual('NZD: 3');
        });

        it('should display value without label', () => {
            data.datasets[1].label = undefined;
            expect($ctrl.generateTooltip(tooltip, data)).toEqual(3);
        });
    });

    describe('mutateUnconverted', () => {
        const data = {
            totals: [{
                month_totals: [{ amount: 1.2 }]
            }]
        };
        it('should round month totals', () => {
            expect($ctrl.mutateUnconverted(data)).toEqual([[1]]);
        });
    });
});
