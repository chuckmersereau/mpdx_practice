import * as moment from 'moment';
import component from './donations.component';

let data: any = [
    {
        id: 'b0a2f8fd-812d-4119-8949-55845128c651',
        amount: '75.0',
        currency: 'CAD'
    },
    {
        id: '59ef07db-adca-4445-8f25-c812be712cf7',
        amount: '30.0',
        currency: 'CAD'
    },
    {
        id: '0599e04b-9e35-4afb-9ba9-f5f047ce14c5',
        amount: '175.0',
        currency: 'USD'
    },
    {
        id: 'c1877e5b-70b1-4a1f-8120-10a73e3c6c70',
        amount: '10.0',
        currency: 'USD'
    }
];
data.meta = {
    pagination: {
        page: '1',
        total_pages: 1
    }
};

describe('reports.donations.component', () => {
    let $ctrl, scope, rootScope, stateParams, donations, designationAccounts, api, serverConstants, q;

    beforeEach(() => {
        angular.mock.module(component);
        inject((
            $componentController, $rootScope, $stateParams, _donations_, _api_, _designationAccounts_,
            _serverConstants_, $q
        ) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            api = _api_;
            api.account_list_id = 'account_list_id';
            designationAccounts = _designationAccounts_;
            serverConstants = _serverConstants_;
            stateParams = $stateParams;
            donations = _donations_;
            q = $q;
            $ctrl = $componentController('donations', { $scope: scope }, { inContact: false });
        });
    });

    describe('constructor', () => {
        it('should set default values', () => {
            expect($ctrl.enableNext).toEqual(false);
            expect($ctrl.data).toEqual([]);
            expect($ctrl.listLoadCount).toEqual(0);
            expect($ctrl.loading).toEqual(false);
            expect($ctrl.meta).toEqual({});
            expect($ctrl.page).toEqual(0);
            expect($ctrl.pageSize).toEqual(25);
            expect($ctrl.totalContactCount).toEqual(0);
            expect($ctrl.sort).toEqual('donation_date');
            expect($ctrl.sortReverse).toBeTruthy();
            expect($ctrl.totals).toEqual({});
        });

        it('should call $ctrl.load on accountListUpdated', () => {
            spyOn($ctrl, 'load').and.callFake(() => q.resolve());
            rootScope.$emit('accountListUpdated');
            expect($ctrl.load).toHaveBeenCalled();
        });
    });

    describe('$onInit', () => {
        const donation = { id: 1 };
        let result: any = [donation];
        const meta = {
            pagination: {
                page: 1
            }
        };
        result.meta = meta;

        beforeEach(() => {
            spyOn($ctrl, 'load').and.callFake(() => {});
        });

        afterEach(() => {
            $ctrl.$onDestroy();
        });

        it('should set startDate', () => {
            $ctrl.$onInit();
            expect($ctrl.startDate).toEqual(moment().startOf('month'));
        });

        it('should call $ctrl.load', () => {
            $ctrl.$onInit();
            expect($ctrl.load).toHaveBeenCalledWith();
        });

        describe('stateParams.startDate set', () => {
            beforeEach(() => {
                stateParams.startDate = moment().startOf('month').subtract(1, 'month');
            });

            it('sets startDate to stateParams.startDate', () => {
                $ctrl.$onInit();
                expect($ctrl.startDate).toEqual(moment().startOf('month').subtract(1, 'month'));
            });
        });

        it('should set watchers', () => {
            $ctrl.$onInit();
            expect($ctrl.watcher).toBeDefined();
            expect($ctrl.watcher2).toBeDefined();
        });

        it('should handle donation additions', () => {
            $ctrl.data = [];
            $ctrl.$onInit();
            $ctrl.meta = meta;
            rootScope.$emit('donationUpdated', donation);
            expect($ctrl.data).toEqual([donation]);
        });

        it('should handle donation updates', () => {
            const patch = { id: 1, v: 'a' };
            $ctrl.data = [donation];
            $ctrl.$onInit();
            $ctrl.meta = meta;
            rootScope.$emit('donationUpdated', patch);
            expect($ctrl.data).toEqual([patch]);
        });

        it('should remove a donation', () => {
            $ctrl.data = [donation, { id: 2 }];
            $ctrl.meta = meta;
            $ctrl.$onInit();
            rootScope.$emit('donationRemoved', { id: 1 });
            rootScope.$digest();
            expect($ctrl.data).toEqual([{ id: 2 }]);
        });

        it('should call load on designationAccountSelectorChanged', () => {
            $ctrl.$onInit();
            rootScope.$emit('designationAccountSelectorChanged');
            expect($ctrl.load).toHaveBeenCalledWith();
        });

        it('should call $ctrl.load', () => {
            $ctrl.data = [donation, { id: 2 }];
            $ctrl.meta = meta;
            $ctrl.$onInit();
            rootScope.$emit('donationRemoved', { id: 1 });
            rootScope.$digest();
            expect($ctrl.load).toHaveBeenCalledWith();
        });
    });

    describe('$onChanges', () => {
        it('should call $ctrl.load', () => {
            spyOn($ctrl, 'load').and.callFake(() => {});
            $ctrl.$onChanges({
                contact: {
                    isFirstChange: () => false
                }
            });
            expect($ctrl.load).toHaveBeenCalledWith();
        });
    });

    describe('load', () => {
        beforeEach(() => {
            $ctrl.startDate = moment().startOf('month');
            spyOn($ctrl, 'getDonations').and.callFake(() => q.resolve(data));
            spyOn($ctrl, 'mutateDataForSorts').and.callFake((data) => data);
        });

        it('should set params', () => {
            $ctrl.load();
            expect($ctrl.getDonations).toHaveBeenCalledWith({
                startDate: $ctrl.startDate,
                endDate: $ctrl.endDate
            });
        });

        it('should set loading to true', () => {
            $ctrl.load();
            expect($ctrl.loading).toEqual(true);
        });

        it('should set loading to false', (done) => {
            $ctrl.load().then(() => {
                expect($ctrl.loading).toEqual(false);
                done();
            });
            scope.$digest();
        });

        it('should set meta', (done) => {
            $ctrl.load().then(() => {
                expect($ctrl.meta).toEqual(data.meta);
                done();
            });
            scope.$digest();
        });

        it('should reset data', (done) => {
            $ctrl.data = [{ id: 'test' }];
            $ctrl.load().then(() => {
                expect($ctrl.data).toEqual(data);
                done();
            });
            scope.$digest();
        });

        it('shouldn\'t load out of turn', (done) => {
            spyOn($ctrl, 'loadedOutOfTurn').and.callFake(() => true);
            $ctrl.load().then((data) => {
                expect(data).toEqual(null);
                done();
            });
            scope.$digest();
        });

        describe('designationAccounts selected', () => {
            beforeEach(() => {
                designationAccounts.selected = ['abc', 'def'];
            });

            it('should call api with params', () => {
                $ctrl.load();
                expect($ctrl.getDonations).toHaveBeenCalledWith({
                    designationAccountId: 'abc,def',
                    startDate: $ctrl.startDate,
                    endDate: $ctrl.endDate
                });
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

            it('should set params', () => {
                $ctrl.load();
                expect($ctrl.getDonations).toHaveBeenCalledWith({
                    donorAccountId: '123'
                });
            });

            it('should return rejected promise when no donor accounts', (done) => {
                $ctrl.contacts.current.donor_accounts = [];
                $ctrl.load(1).catch(() => {
                    done();
                });
                rootScope.$digest();
            });
        });
    });

    describe('setMonths', () => {
        beforeEach(() => {
            $ctrl.startDate = moment().startOf('month');
        });

        it('should set previousMonth', () => {
            $ctrl.setMonths();
            expect($ctrl.previousMonth).toEqual(moment($ctrl.startDate).subtract(1, 'month'));
        });

        it('should set nextMonth', () => {
            $ctrl.setMonths();
            expect($ctrl.nextMonth).toEqual(moment($ctrl.startDate).add(1, 'month'));
        });

        it('should set endDate', () => {
            $ctrl.setMonths();
            expect($ctrl.endDate).toEqual(moment($ctrl.startDate).endOf('month'));
        });

        it('should set enableNext to false', () => {
            $ctrl.setMonths();
            expect($ctrl.enableNext).toEqual(false);
        });

        describe('setMonths', () => {
            beforeEach(() => {
                $ctrl.startDate = moment().startOf('month').subtract(1, 'month');
            });

            it('should set enableNext to true', () => {
                $ctrl.setMonths();
                expect($ctrl.enableNext).toEqual(true);
            });
        });
    });

    describe('gotoNextMonth', () => {
        beforeEach(() => {
            $ctrl.nextMonth = moment().startOf('month').add(1, 'month');
            spyOn($ctrl, 'load').and.callFake(() => q.resolve());
            $ctrl.totals = { usd: 'a' };
        });

        it('should set startDate to nextMonth', () => {
            $ctrl.gotoNextMonth();
            expect($ctrl.startDate).toEqual($ctrl.nextMonth);
        });

        it('should call $ctrl.load', () => {
            $ctrl.gotoNextMonth();
            expect($ctrl.load).toHaveBeenCalledWith();
        });

        it('should set totals to fresh object', () => {
            $ctrl.gotoNextMonth();
            expect($ctrl.totals).toEqual({});
        });
    });

    describe('gotoPrevMonth', () => {
        beforeEach(() => {
            $ctrl.previousMonth = moment().startOf('month').subtract(1, 'month');
            spyOn($ctrl, 'load').and.callFake(() => q.resolve());
            $ctrl.totals = { usd: 'a' };
        });

        it('should set startDate to previousMonth', () => {
            $ctrl.gotoPrevMonth();
            expect($ctrl.startDate).toEqual($ctrl.previousMonth);
        });

        it('should call $ctrl.load', () => {
            $ctrl.gotoPrevMonth();
            expect($ctrl.load).toHaveBeenCalledWith();
        });

        it('should set totals to fresh object', () => {
            $ctrl.gotoNextMonth();
            expect($ctrl.totals).toEqual({});
        });
    });

    describe('getDonations', () => {
        beforeEach(() => {
            spyOn(api, 'get').and.callFake((url, data) => q.resolve(data));
        });

        it('should call api.get', () => {
            $ctrl.getDonations();
            expect(api.get).toHaveBeenCalledWith(
                'account_lists/account_list_id/donations',
                {
                    per_page: 10000,
                    fields: {
                        contacts: 'name',
                        designation_account: 'display_name,designation_number',
                        donor_account: 'display_name,account_number',
                        appeal: 'name'
                    },
                    filter: {},
                    include: 'designation_account,donor_account,contact,appeal'
                }
            );
        });

        describe('selected designationAccounts', () => {
            let params = {};

            beforeEach(() => {
                params = { designationAccountId: 'abc,def' };
            });

            it('should call $ctrl.getDonationChart with params', () => {
                $ctrl.getDonations(params);
                expect(api.get).toHaveBeenCalledWith(
                    `account_lists/${api.account_list_id}/donations`,
                    {
                        per_page: 10000,
                        fields: {
                            contacts: 'name',
                            designation_account: 'display_name,designation_number',
                            donor_account: 'display_name,account_number',
                            appeal: 'name'
                        },
                        filter: {
                            designation_account_id: 'abc,def'
                        },
                        include: 'designation_account,donor_account,contact,appeal'
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
                    $ctrl.getDonations(params).then((data) => {
                        expect(data.filter).toEqual({});
                        done();
                    });
                    scope.$digest();
                });
            });

            describe('only endDate set', () => {
                beforeEach(() => {
                    params = { endDate: moment().endOf('month') };
                });

                it('should not set donation_date in params', (done) => {
                    $ctrl.getDonations(params).then((data) => {
                        expect(data.filter).toEqual({});
                        done();
                    });
                    scope.$digest();
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
                        $ctrl.getDonations(params).then((data) => {
                            expect(data.filter.donation_date).toEqual(
                                `${params.startDate.format('YYYY-MM-DD')}..${params.endDate.format('YYYY-MM-DD')}`
                            );
                            done();
                        });
                        scope.$digest();
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
                        $ctrl.getDonations(params).then((data) => {
                            expect(data.filter).toEqual({});
                            done();
                        });
                        scope.$digest();
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
                        $ctrl.getDonations(params).then((data) => {
                            expect(data.filter).toEqual({});
                            done();
                        });
                        scope.$digest();
                    });
                });
            });
        });

        describe('donorAccountId', () => {
            const params = { donorAccountId: 'donor_account_id' };

            it('should set donorAccountId in params', (done) => {
                $ctrl.getDonations(params).then((data) => {
                    expect(data.filter.donor_account_id).toEqual(params.donorAccountId);
                    done();
                });
                scope.$digest();
            });
        });
    });

    describe('loadedOutOfTurn', () => {
        it('should return true if wrong load count', () => {
            $ctrl.listLoadCount = 0;
            expect($ctrl.loadedOutOfTurn(1)).toBeTruthy();
        });

        it('shouldn\'t return true if correct count', () => {
            $ctrl.listLoadCount = 0;
            expect($ctrl.loadedOutOfTurn(0)).toBeFalsy();
        });
    });

    describe('mutateDataForSorts', () => {
        const data = [{
            converted_amount: '1.0',
            currency: 'USD',
            converted_currency: 'AUD'
        }];
        beforeEach(() => {
            spyOn(serverConstants, 'getPledgeCurrencySymbol').and.callFake((data) => 't' + data);
        });

        it('should set converted_amount to a Number', () => {
            const result = $ctrl.mutateDataForSorts(data);
            expect(result[0].converted_amount).toEqual(1);
        });

        it('should get currency symbol', () => {
            const result = $ctrl.mutateDataForSorts(data);
            expect(result[0].converted_symbol).toEqual('tAUD');
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

    describe('sumCurrency', () => {
        it('should set the month total', () => {
            $ctrl.sumCurrency('USD', '2');
            expect($ctrl.totals['USD']).toEqual(2);
            $ctrl.sumCurrency('USD', 2);
            expect($ctrl.totals['USD']).toEqual(4);
        });
    });
});
