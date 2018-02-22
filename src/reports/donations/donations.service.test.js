import service from './donations.service';

describe('reports.donations.service', () => {
    let api, donations, gettextCatalog, modal;

    beforeEach(() => {
        angular.mock.module(service);
        inject((_api_, _donations_, _gettextCatalog_, _modal_) => {
            api = _api_;
            donations = _donations_;
            modal = _modal_;
            api.account_list_id = 'account_list_id';
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
