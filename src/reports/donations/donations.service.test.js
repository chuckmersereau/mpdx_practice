import service from './donations.service';
import moment from 'moment';

describe('reports.donations.service', () => {
    let $log, api, donations, modal;

    beforeEach(() => {
        angular.mock.module(service);
        inject((_$log_, _api_, _donations_, _modal_) => {
            $log = _$log_;
            api = _api_;
            donations = _donations_;
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
                        donation: {}
                    },
                    resolve: {
                        0: jasmine.any(Function)
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
                    },
                    resolve: {
                        0: jasmine.any(Function)
                    }
                });
            });
        });
    });
});
