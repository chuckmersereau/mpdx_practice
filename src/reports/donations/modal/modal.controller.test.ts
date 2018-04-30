import modalController from './modal.controller';
import { isEqual } from 'lodash/fp';

let donation = {
    id: 'donation_id',
    amount: '0.00',
    motivation: 'a',
    pledge: { id: 'pledge_id' },
    contact: { id: 'contact_id' }
};
const appealId = 'appeal_id';

xdescribe('donation.modal.controller', () => {
    let $ctrl, controller, scope, gettextCatalog, accounts, modal, designationAccounts, api, rootScope, appeals, q;
    beforeEach(() => {
        angular.mock.module(modalController);
        inject((
            $controller, $rootScope, _gettextCatalog_, _accounts_, _designationAccounts_, _api_, _modal_, _appeals_, $q
        ) => {
            controller = $controller;
            rootScope = $rootScope;
            scope = $rootScope.$new();
            scope.$hide = () => {};
            appeals = _appeals_;
            api = _api_;
            gettextCatalog = _gettextCatalog_;
            accounts = _accounts_;
            modal = _modal_;
            q = $q;
            designationAccounts = _designationAccounts_;
            loadController();
        });
        spyOn(gettextCatalog, 'getString').and.callThrough();
        spyOn(rootScope, '$emit').and.callFake(() => {});
    });

    function loadController(data: any = donation) {
        if (!accounts.current) {
            accounts.current = {};
        }
        $ctrl = controller('donationModalController as $ctrl', {
            $scope: scope,
            donation: data
        });
    }

    describe('constructor', () => {
        it('should clone the donation', () => {
            expect(isEqual($ctrl.donation, donation)).toBeTruthy();
            expect($ctrl.donation !== donation).toBeTruthy();
        });

        it('should set the initialDonation', () => {
            expect($ctrl.initialDonation).toEqual(donation);
        });
        it('should handle a null motivation', () => {
            const donation = { id: 'donation_id', amount: '0.00' };
            loadController(donation);
            expect($ctrl.donation.motivation).toEqual('');
        });
    });

    describe('activate', () => {
        describe('no currency set', () => {
            beforeEach(() => {
                accounts.current = { currency: 'NZD' };
            });

            it('should set the currency to account currency', () => {
                $ctrl.activate();
                expect($ctrl.donation.currency).toEqual(accounts.current.currency);
            });
        });

        describe('no designation account set', () => {
            beforeEach(() => {
                spyOn($ctrl, 'setDesignationAccount').and.callFake(() => {});
            });

            it('should set the initialDonation', () => {
                $ctrl.activate();
                expect($ctrl.setDesignationAccount).toHaveBeenCalled();
            });
        });
    });

    describe('setDesignationAccount', () => {
        it('should set the designation_account', (done) => {
            spyOn(designationAccounts, 'load').and.callFake(() => q.resolve([{ id: 'designation_id' }]));
            $ctrl.setDesignationAccount().then(() => {
                expect($ctrl.donation.designation_account).toEqual({ id: 'designation_id' });
                done();
            });
            rootScope.$digest();
        });
    });

    describe('save', () => {
        const successMessage = 'Donation saved successfully';
        const errorMessage = 'Unable to save changes to donation';
        describe('promise resolved', () => {
            beforeEach(() => {
                spyOn($ctrl, 'getSavePromise').and.callFake((data) => q.resolve(data));
                spyOn(scope, '$hide').and.callFake(() => {});
            });
            it('should call donations.save', () => {
                $ctrl.save();
                expect($ctrl.getSavePromise).toHaveBeenCalledWith({ id: 'donation_id' }, successMessage, errorMessage);
                expect(gettextCatalog.getString).toHaveBeenCalledWith(successMessage);
                expect(gettextCatalog.getString).toHaveBeenCalledWith(errorMessage);
            });
            it('should hide modal', (done) => {
                $ctrl.save().then(() => {
                    expect(scope.$hide).toHaveBeenCalled();
                    done();
                });
                rootScope.$digest();
            });
        });

        describe('remove appeal', () => {
            beforeEach(() => {
                spyOn($ctrl, 'getSavePromise').and.callFake((data) => q.resolve(data));
                $ctrl.initialDonation.appeal = { id: 'appeal_id' };
                $ctrl.donation.appeal = null;
            });

            it('should update with empty appeal', (done) => {
                $ctrl.save().then(() => {
                    expect($ctrl.getSavePromise).toHaveBeenCalledWith({
                        id: 'donation_id',
                        appeal: { id: 'none' }
                    }, successMessage, errorMessage);
                    expect(gettextCatalog.getString).toHaveBeenCalledWith(successMessage);
                    expect(gettextCatalog.getString).toHaveBeenCalledWith(errorMessage);
                    done();
                });
                rootScope.$digest();
            });
        });

        describe('calls save with patch only', () => {
            beforeEach(() => {
                spyOn($ctrl, 'getSavePromise').and.callFake((data) => q.resolve(data));
                $ctrl.initialDonation
                    = { id: 'donation_id', sameVal: 'value', sameObj: {}, patchVal: null, patchObj: null };
                $ctrl.donation
                    = { id: 'donation_id', sameVal: 'value', sameObj: {}, patchVal: 'value', patchObj: {} };
            });

            it('should update with empty appeal', (done) => {
                const successMessage = 'Donation saved successfully';
                const errorMessage = 'Unable to save changes to donation';
                $ctrl.save().then(() => {
                    expect($ctrl.getSavePromise).toHaveBeenCalledWith({
                        id: 'donation_id',
                        patchVal: 'value',
                        patchObj: {}
                    }, successMessage, errorMessage);
                    done();
                });
                rootScope.$digest();
            });
        });
    });

    describe('delete', () => {
        describe('promise resolved', () => {
            beforeEach(() => {
                spyOn(api, 'delete').and.callFake(() => q.resolve());
                spyOn(scope, '$hide').and.callFake(() => {});
                spyOn(modal, 'confirm').and.returnValue(q.resolve());
                spyOn($ctrl, 'removePledgeThenContact').and.returnValue(q.resolve());
            });

            it('should call modal.confirm', () => {
                $ctrl.delete();
                expect(modal.confirm).toHaveBeenCalled();
                expect(gettextCatalog.getString).toHaveBeenCalledWith('Are you sure you wish to delete the selected donation?');
            });

            it('should call donations.delete', (done) => {
                const successMessage = 'Donation deleted successfully';
                const errorMessage = 'Unable to remove donation';
                $ctrl.delete().then(() => {
                    expect(api.delete).toHaveBeenCalledWith(
                        `account_lists/${api.account_list_id}/donations/${donation.id}`,
                        { id: donation.id },
                        successMessage,
                        errorMessage
                    );
                    expect(gettextCatalog.getString).toHaveBeenCalledWith(successMessage);
                    expect(gettextCatalog.getString).toHaveBeenCalledWith(errorMessage);
                    done();
                });
                rootScope.$digest();
            });

            it('should hide modal', (done) => {
                $ctrl.delete().then(() => {
                    expect(scope.$hide).toHaveBeenCalled();
                    done();
                });
                rootScope.$digest();
            });

            it('should emit to the rootscope', (done) => {
                $ctrl.delete().then(() => {
                    expect(rootScope.$emit).toHaveBeenCalledWith('donationRemoved', { id: donation.id });
                    done();
                });
                rootScope.$digest();
            });

            it('should call removePledgeThenContact', (done) => {
                $ctrl.originalAppealId = appealId;
                $ctrl.delete().then(() => {
                    expect($ctrl.removePledgeThenContact).toHaveBeenCalledWith(donation, appealId);
                    done();
                });
                rootScope.$digest();
            });
        });
    });

    describe('onDonorAccountSelected', () => {
        const donorAccount = { id: 'donor_account' };

        beforeEach(() => {
            $ctrl.donation.donor_account = null;
        });

        it('should set donation donor account', () => {
            $ctrl.onDonorAccountSelected(donorAccount);
            expect($ctrl.donation.donor_account).toEqual(donorAccount);
        });
    });

    describe('onDesignationAccountSelected', () => {
        const designationAccount = { id: 'designation_account' };

        beforeEach(() => {
            $ctrl.donation.designation_account = null;
        });

        it('should set donation donor account', () => {
            $ctrl.onDesignationAccountSelected(designationAccount);
            expect($ctrl.donation.designation_account).toEqual(designationAccount);
        });
    });

    describe('onAppealSelected', () => {
        const appeal = { id: 'appeal_id' };

        beforeEach(() => {
            $ctrl.donation.appeal = null;
        });

        it('should set donation donor account', () => {
            $ctrl.onAppealSelected(appeal);
            expect($ctrl.donation.appeal).toEqual(appeal);
        });
        it('should set amount to amount if appeal isn\'t null', () => {
            $ctrl.donation.appeal_amount = 12;
            $ctrl.onAppealSelected(appeal);
            expect($ctrl.donation.appeal_amount).toEqual(12);
        });
        it('should set amount to null if appeal is null', () => {
            $ctrl.donation.appeal_amount = 12;
            $ctrl.onAppealSelected(null);
            expect($ctrl.donation.appeal_amount).toEqual(null);
        });
    });

    describe('search', () => {
        const keywords = 'my keywords';
        beforeEach(() => {
            spyOn(api, 'get').and.callFake((url, data) => q.resolve(data));
        });

        it('should return a promise', () => {
            expect($ctrl.search(keywords)).toEqual(jasmine.any(q));
        });

        it('should call api.get', () => {
            $ctrl.search(keywords);
            expect(api.get).toHaveBeenCalledWith(
                'appeals',
                {
                    filter: {
                        wildcard_search: keywords,
                        account_list_id: api.account_list_id
                    },
                    fields: {
                        appeals: 'name'
                    },
                    sort: '-created_at',
                    per_page: 6
                }
            );
        });
    });

    describe('getSavePromise', () => {
        const successMessage = 'a';
        const errorMessage = 'b';
        beforeEach(() => {
            spyOn(api, 'post').and.callFake(() => q.resolve());
            spyOn(api, 'put').and.callFake(() => q.resolve());
            api.account_list_id = '123';
        });
        describe('donation exists', () => {
            const donation = { id: 'donation_id' };
            it('should call api.put', (done) => {
                $ctrl.getSavePromise(donation, successMessage, errorMessage).then(() => {
                    expect(api.put).toHaveBeenCalledWith(
                        'account_lists/123/donations/donation_id',
                        donation, successMessage, errorMessage
                    );
                    done();
                });
                rootScope.$digest();
            });
        });

        describe('donation does not exist', () => {
            const donation = {};
            it('should call api.post', (done) => {
                $ctrl.getSavePromise(donation, successMessage, errorMessage).then(() => {
                    expect(api.post).toHaveBeenCalledWith(
                        'account_lists/123/donations',
                        donation, successMessage, errorMessage
                    );
                    done();
                });
                rootScope.$digest();
            });
        });

        describe('amount contains non-numeric characters', () => {
            const donation = { amount: '$10.10 USD' };
            it('should remove characters from amount', (done) => {
                $ctrl.getSavePromise(donation, successMessage, errorMessage).then(() => {
                    expect(api.post).toHaveBeenCalledWith(
                        'account_lists/123/donations',
                        { amount: '10.10' },
                        successMessage, errorMessage
                    );
                    done();
                });
                rootScope.$digest();
            });
        });
    });

    describe('removePledgeThenContact', () => {
        const msg = 'Would you also like to remove the associated commitment from the appeal?';
        beforeEach(() => {
            spyOn(modal, 'confirm').and.callFake(() => q.resolve());
            spyOn(appeals, 'removePledge').and.callFake(() => q.resolve());
            spyOn($ctrl, 'removeContact').and.callFake(() => q.resolve());
        });
        it('shouldn\'t continue without a pledge id ', () => {
            expect($ctrl.removePledgeThenContact()).toBeUndefined();
        });
        it('should translate a message', () => {
            $ctrl.removePledgeThenContact(donation, appealId);
            expect(gettextCatalog.getString).toHaveBeenCalledWith(msg);
        });
        it('should confirm before delete', () => {
            $ctrl.removePledgeThenContact(donation, appealId);
            expect(modal.confirm).toHaveBeenCalledWith(msg);
        });
        it('should remove the pledge', (done) => {
            $ctrl.removePledgeThenContact(donation, appealId).then(() => {
                expect(appeals.removePledge).toHaveBeenCalledWith(donation.pledge.id);
                done();
            });
            rootScope.$digest();
        });
        it('should remove the contact', (done) => {
            $ctrl.removePledgeThenContact(donation, appealId).then(() => {
                expect($ctrl.removeContact).toHaveBeenCalledWith(donation, appealId);
                done();
            });
            rootScope.$digest();
        });
    });
    describe('removeContact', () => {
        beforeEach(() => {
            spyOn(modal, 'confirm').and.callFake(() => q.resolve());
            spyOn(appeals, 'removeContact').and.callFake(() => q.resolve());
        });
        const msg = 'Would you like to also remove the contact from the the appeal?';
        it('should translate a message', () => {
            $ctrl.removeContact(donation, appealId);
            expect(gettextCatalog.getString).toHaveBeenCalledWith(msg);
        });
        it('should confirm before delete', () => {
            $ctrl.removeContact(donation, appealId);
            expect(modal.confirm).toHaveBeenCalledWith(msg);
        });
        it('should remove the contact', (done) => {
            $ctrl.removeContact(donation, appealId).then(() => {
                expect(appeals.removeContact).toHaveBeenCalledWith(appealId, donation.contact.id);
                done();
            });
            rootScope.$digest();
        });
    });
});
