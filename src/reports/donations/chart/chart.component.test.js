import component from './chart.component';
import moment from 'moment';

describe('home.connect', () => {
    let $ctrl, componentController, scope, rootScope, api;

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _api_) => {
            componentController = $componentController;
            rootScope = $rootScope;
            scope = rootScope.$new();
            api = _api_;
            loadController();
        });
    });

    function loadController() {
        $ctrl = componentController('donationsChart', {$scope: scope}, {inContact: false});
    }

    describe('getDonationChart', () => {
        beforeEach(() => {
            spyOn(api, 'get').and.callFake((url, data) => Promise.resolve(data));
        });

        it('should return a promise', () => {
            expect($ctrl.getDonationChart()).toEqual(jasmine.any(Promise));
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

        describe('date range', () => {
            let params = {};

            describe('only startDate set', () => {
                beforeEach(() => {
                    params = {startDate: moment().startOf('month')};
                });

                it('should not set donation_date in params', (done) => {
                    $ctrl.getDonationChart(params).then((data) => {
                        expect(data.filter).toEqual({account_list_id: api.account_list_id});
                        done();
                    });
                });
            });

            describe('only endDate set', () => {
                beforeEach(() => {
                    params = {endDate: moment().endOf('month')};
                });

                it('should not set donation_date in params', (done) => {
                    $ctrl.getDonationChart(params).then((data) => {
                        expect(data.filter).toEqual({account_list_id: api.account_list_id});
                        done();
                    });
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
                            expect(data.filter).toEqual({account_list_id: api.account_list_id});
                            done();
                        });
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
                            expect(data.filter).toEqual({account_list_id: api.account_list_id});
                            done();
                        });
                    });
                });
            });
        });

        describe('donorAccountId', () => {
            const params = {donorAccountId: 'donor_account_id'};

            it('should set donorAccountId in params', (done) => {
                $ctrl.getDonationChart(params).then((data) => {
                    expect(data.filter.donor_account_id).toEqual(params.donorAccountId);
                    done();
                });
            });
        });
    });
});