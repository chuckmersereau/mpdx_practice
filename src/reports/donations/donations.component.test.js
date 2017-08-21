import component from './donations.component';
import moment from 'moment';

describe('reports.donations.component', () => {
    let $ctrl, componentController, scope, rootScope, stateParams, donations;

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, $stateParams, _donations_) => {
            componentController = $componentController;
            rootScope = $rootScope;
            scope = rootScope.$new();
            stateParams = $stateParams;
            donations = _donations_;
            loadController();
        });
    });

    function loadController() {
        $ctrl = componentController('donations', { $scope: scope }, { inContact: false });
    }

    describe('constructor', () => {
        it('should set default values', () => {
            expect($ctrl.enableNext).toEqual(false);
            expect($ctrl.data).toEqual([]);
            expect($ctrl.listLoadCount).toEqual(0);
            expect($ctrl.loading).toEqual(false);
            expect($ctrl.meta).toEqual({});
            expect($ctrl.models).toEqual({
                addTags: {
                    newTag: ''
                }
            });
            expect($ctrl.page).toEqual(0);
            expect($ctrl.pageSize).toEqual(0);
            expect($ctrl.totalContactCount).toEqual(0);
        });

        it('should call $ctrl.load on accountListUpdated', () => {
            spyOn($ctrl, 'load').and.returnValue();
            rootScope.$emit('accountListUpdated');
            expect($ctrl.load).toHaveBeenCalled();
        });
    });

    describe('$onInit', () => {
        it('should set startDate', () => {
            $ctrl.$onInit();
            expect($ctrl.startDate).toEqual(moment().startOf('month'));
        });

        it('should call $ctrl.load', () => {
            spyOn($ctrl, 'load').and.returnValue();
            $ctrl.$onInit();
            expect($ctrl.load).toHaveBeenCalledWith(1, true);
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
    });

    describe('$onChanges', () => {
        it('should call $ctrl.load', () => {
            spyOn($ctrl, 'load').and.returnValue();
            $ctrl.$onChanges({
                contact: {
                    isFirstChange: () => false
                }
            });
            expect($ctrl.load).toHaveBeenCalledWith(1, true);
        });
    });


    describe('loadMoreDonations', () => {
        beforeEach(() => {
            spyOn($ctrl, 'load').and.returnValue();
            $ctrl.meta = {
                pagination: {
                    total_pages: 1
                }
            };
        });

        it('should call $ctrl.load', () => {
            $ctrl.loadMoreDonations();
            expect($ctrl.load).toHaveBeenCalledWith(1);
        });

        describe('loading', () => {
            beforeEach(() => {
                $ctrl.loading = true;
            });

            it('should not call $ctrl.load', () => {
                $ctrl.loadMoreDonations();
                expect($ctrl.load).not.toHaveBeenCalled();
            });
        });

        describe('all pages loaded', () => {
            beforeEach(() => {
                $ctrl.page = 1;
            });

            it('should not call $ctrl.load', () => {
                $ctrl.loadMoreDonations();
                expect($ctrl.load).not.toHaveBeenCalled();
            });
        });
    });

    describe('load', () => {
        beforeEach(() => {
            $ctrl.startDate = moment().startOf('month');
            spyOn(donations, 'getDonations').and.callFake(() => Promise.resolve(data));
        });

        it('should set params', () => {
            $ctrl.load(1, true);
            expect(donations.getDonations).toHaveBeenCalledWith({
                page: 1,
                startDate: $ctrl.startDate,
                endDate: $ctrl.endDate
            });
        });

        it('should set loading to true', () => {
            $ctrl.load(1, true);
            expect($ctrl.loading).toEqual(true);
        });

        it('should return promise', () => {
            expect($ctrl.load(1, true)).toEqual(jasmine.any(Promise));
        });

        describe('promise successful', () => {
            it('should set loading to false', (done) => {
                $ctrl.load(1, true).then(() => {
                    expect($ctrl.loading).toEqual(false);
                    done();
                });
            });

            it('should set meta', (done) => {
                $ctrl.load(1, true).then(() => {
                    expect($ctrl.meta).toEqual(data.meta);
                    done();
                });
            });

            it('should set totals', (done) => {
                $ctrl.load(1, true).then(() => {
                    expect($ctrl.totals).toEqual({
                        CAD: { amount: 105, count: 2 },
                        USD: { amount: 185, count: 2 }
                    });
                    done();
                });
            });

            describe('reset', () => {
                beforeEach(() => {
                    $ctrl.data = [{ id: 'test' }];
                });

                it('should reset data', (done) => {
                    $ctrl.load(1, true).then(() => {
                        expect($ctrl.data).toEqual(data);
                        done();
                    });
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
                $ctrl.load(1);
                expect(donations.getDonations).toHaveBeenCalledWith({
                    page: 1,
                    donorAccountId: '123'
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
                });
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
            spyOn($ctrl, 'load').and.returnValue();
        });

        it('should set startDate to nextMonth', () => {
            $ctrl.gotoNextMonth();
            expect($ctrl.startDate).toEqual($ctrl.nextMonth);
        });

        it('should call $ctrl.load', () => {
            $ctrl.gotoNextMonth();
            expect($ctrl.load).toHaveBeenCalledWith(1, true);
        });
    });

    describe('gotoPrevMonth', () => {
        beforeEach(() => {
            $ctrl.previousMonth = moment().startOf('month').subtract(1, 'month');
            spyOn($ctrl, 'load').and.returnValue();
        });

        it('should set startDate to previousMonth', () => {
            $ctrl.gotoPrevMonth();
            expect($ctrl.startDate).toEqual($ctrl.previousMonth);
        });

        it('should call $ctrl.load', () => {
            $ctrl.gotoPrevMonth();
            expect($ctrl.load).toHaveBeenCalledWith(1, true);
        });
    });

    describe('openDonationModal', () => {
        beforeEach(() => {
            spyOn(donations, 'openDonationModal').and.callFake((data) => Promise.resolve(data));
        });

        it('should call donations openDonationModal', () => {
            $ctrl.openDonationModal({ id: 1 });
            expect(donations.openDonationModal).toHaveBeenCalledWith({ id: 1 });
        });

        it('should return a promise', () => {
            expect($ctrl.openDonationModal({ id: 1 })).toEqual(jasmine.any(Promise));
        });

        describe('promise successful', () => {
            it('should call $ctrl.load', (done) => {
                spyOn($ctrl, 'load').and.returnValue();
                $ctrl.openDonationModal({ id: 1 }).then(() => {
                    expect($ctrl.load).toHaveBeenCalled();
                    done();
                });
            });
        });
    });
});

let data = [
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
