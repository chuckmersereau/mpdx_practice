import service from './donations.service';
import moment from 'moment';

describe('reports.donations.service', () => {
    let $log, api, donations, gettextCatalog, modal;

    beforeEach(() => {
        angular.mock.module(service);
        inject((_$log_, _api_, _donations_, _gettextCatalog_, _modal_) => {
            $log = _$log_;
            api = _api_;
            donations = _donations_;
            gettextCatalog = _gettextCatalog_;
            modal = _modal_;
            api.account_list_id = 'account_list_id';
        });
    });

    describe('getDonations', () => {
        beforeEach(() => {
            spyOn(api, 'get').and.callFake((url, data) => Promise.resolve(data));
            spyOn($log, 'debug').and.returnValue();
        });

        it('should return a promise', () => {
            expect(donations.getDonations()).toEqual(jasmine.any(Promise));
        });

        it('should call api.get', () => {
            donations.getDonations();
            expect(api.get).toHaveBeenCalledWith(
                'account_lists/account_list_id/donations',
                {
                    fields: {
                        contacts: 'name',
                        designation_account: 'display_name,designation_number',
                        donor_account: 'display_name,account_number',
                        appeal: 'name'
                    },
                    filter: {},
                    include: 'designation_account,donor_account,contact,appeal',
                    sort: '-donation_date'
                }
            );
        });

        it('should log promise results to console', (done) => {
            donations.getDonations().then(() => {
                expect($log.debug).toHaveBeenCalled();
                done();
            });
        });

        describe('date range', () => {
            let params = {};

            describe('only startDate set', () => {
                beforeEach(() => {
                    params = { startDate: moment().startOf('month') };
                });

                it('should not set donation_date in params', (done) => {
                    donations.getDonations(params).then((data) => {
                        expect(data.filter).toEqual({});
                        done();
                    });
                });
            });

            describe('only endDate set', () => {
                beforeEach(() => {
                    params = { endDate: moment().endOf('month') };
                });

                it('should not set donation_date in params', (done) => {
                    donations.getDonations(params).then((data) => {
                        expect(data.filter).toEqual({});
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
                        donations.getDonations(params).then((data) => {
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
                        donations.getDonations(params).then((data) => {
                            expect(data.filter).toEqual({});
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
                        donations.getDonations(params).then((data) => {
                            expect(data.filter).toEqual({});
                            done();
                        });
                    });
                });
            });
        });

        describe('donorAccountId', () => {
            const params = { donorAccountId: 'donor_account_id' };

            it('should set donorAccountId in params', (done) => {
                donations.getDonations(params).then((data) => {
                    expect(data.filter.donor_account_id).toEqual(params.donorAccountId);
                    done();
                });
            });
        });

        describe('page', () => {
            const params = { page: 1 };

            it('should set page in params', (done) => {
                donations.getDonations(params).then((data) => {
                    expect(data.page).toEqual(params.page);
                    done();
                });
            });
        });
    });

    describe('save', () => {
        describe('donation exists', () => {
            const donation = { id: 'donation_id' };

            beforeEach(() => {
                spyOn(api, 'put').and.callFake((url, data) => Promise.resolve(data));
            });

            it('should return a promise', () => {
                expect(donations.save(donation)).toEqual(jasmine.any(Promise));
            });

            it('should call api.put', () => {
                donations.save(donation);
                expect(api.put).toHaveBeenCalledWith(
                    'account_lists/account_list_id/donations/donation_id',
                    donation
                );
            });
        });

        describe('donation does not exist', () => {
            const donation = {};

            beforeEach(() => {
                spyOn(api, 'post').and.callFake((url, data) => Promise.resolve(data));
            });

            it('should return a promise', () => {
                expect(donations.save(donation)).toEqual(jasmine.any(Promise));
            });

            it('should call api.post', () => {
                donations.save(donation);
                expect(api.post).toHaveBeenCalledWith(
                    'account_lists/account_list_id/donations',
                    donation
                );
            });
        });

        describe('amount contains non-numeric characters', () => {
            const donation = { amount: '$10.10 USD' };

            beforeEach(() => {
                spyOn(api, 'post').and.callFake((url, data) => Promise.resolve(data));
            });

            it('should remove characters from amount', () => {
                donations.save(donation);
                expect(api.post).toHaveBeenCalledWith(
                    'account_lists/account_list_id/donations',
                    { amount: '10.10' }
                );
            });
        });
    });

    describe('delete', () => {
        const donation = { id: 'donation_id' };

        beforeEach(() => {
            spyOn(gettextCatalog, 'getString').and.callThrough();
            spyOn(modal, 'confirm').and.returnValue(Promise.resolve());
        });

        it('should return a promise', () => {
            expect(donations.delete(donation)).toEqual(jasmine.any(Promise));
        });

        it('should call modal.confirm', () => {
            donations.delete(donation);
            expect(modal.confirm).toHaveBeenCalled();
            expect(gettextCatalog.getString).toHaveBeenCalled();
        });

        describe('on confirmation', () => {
            beforeEach(() => {
                spyOn(api, 'delete').and.callFake((url, data) => Promise.resolve(data));
            });

            it('should call api.post', function(done) {
                donations.delete(donation).then(() => {
                    expect(api.delete).toHaveBeenCalledWith(
                        'account_lists/account_list_id/donations/donation_id',
                        donation
                    );
                    done();
                });
            });
        });
    });

    describe('getDonationChart', () => {
        beforeEach(() => {
            spyOn(api, 'get').and.callFake((url, data) => Promise.resolve(data));
            spyOn($log, 'debug').and.returnValue();
        });

        it('should return a promise', () => {
            expect(donations.getDonationChart()).toEqual(jasmine.any(Promise));
        });

        it('should call api.get', () => {
            donations.getDonationChart();
            expect(api.get).toHaveBeenCalledWith(
                'reports/monthly_giving_graph',
                {
                    filter: {
                        account_list_id: api.account_list_id
                    }
                }
            );
        });

        it('should log promise results to console', (done) => {
            donations.getDonationChart().then(() => {
                expect($log.debug).toHaveBeenCalled();
                done();
            });
        });

        describe('date range', () => {
            let params = {};

            describe('only startDate set', () => {
                beforeEach(() => {
                    params = { startDate: moment().startOf('month') };
                });

                it('should not set donation_date in params', (done) => {
                    donations.getDonationChart(params).then((data) => {
                        expect(data.filter).toEqual({ account_list_id: api.account_list_id });
                        done();
                    });
                });
            });

            describe('only endDate set', () => {
                beforeEach(() => {
                    params = { endDate: moment().endOf('month') };
                });

                it('should not set donation_date in params', (done) => {
                    donations.getDonationChart(params).then((data) => {
                        expect(data.filter).toEqual({ account_list_id: api.account_list_id });
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
                        donations.getDonationChart(params).then((data) => {
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
                        donations.getDonationChart(params).then((data) => {
                            expect(data.filter).toEqual({ account_list_id: api.account_list_id });
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
                        donations.getDonationChart(params).then((data) => {
                            expect(data.filter).toEqual({ account_list_id: api.account_list_id });
                            done();
                        });
                    });
                });
            });
        });

        describe('donorAccountId', () => {
            const params = { donorAccountId: 'donor_account_id' };

            it('should set donorAccountId in params', (done) => {
                donations.getDonationChart(params).then((data) => {
                    expect(data.filter.donor_account_id).toEqual(params.donorAccountId);
                    done();
                });
            });
        });
    });

    describe('displayName', () => {
        describe('has contact', () => {
            const donation = {
                contact: {
                    name: 'Test Name'
                },
                donor_account: {
                    account_number: '123'
                }
            };

            it('should return contact name with account number', () => {
                expect(donations.displayName(donation)).toEqual('Test Name (123)');
            });
        });

        describe('has no contact', () => {
            const donation = {
                contact: null,
                donor_account: {
                    display_name: 'test test (123)'
                }
            };

            it('should return donor account display name', () => {
                expect(donations.displayName(donation)).toEqual('test test (123)');
            });
        });
    });

    describe('openDonationModal', () => {
        beforeEach(() => {
            spyOn(modal, 'open').and.callFake(() => {});
        });

        describe('new donation', () => {
            it('should open the donation modal', () => {
                donations.openDonationModal();
                expect(modal.open).toHaveBeenCalledWith({
                    template: require('./modal/modal.html'),
                    controller: 'donationModalController',
                    locals: {
                        donation: { amount: '0' }
                    }
                });
            });
        });

        describe('existing donation', () => {
            const donation = { id: 'donation_id' };
            it('should open the donation modal', () => {
                donations.openDonationModal(donation);
                expect(modal.open).toHaveBeenCalledWith({
                    template: require('./modal/modal.html'),
                    controller: 'donationModalController',
                    locals: {
                        donation: donation
                    }
                });
            });
        });
    });
});
