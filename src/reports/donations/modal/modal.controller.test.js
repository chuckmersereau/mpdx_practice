import modalController from './modal.controller';
import { isEqual } from 'lodash/fp';

describe('donation.modal.controller', () => {
    let $ctrl, controller, scope, gettextCatalog, accounts, alerts, designationAccounts, donations, api, rootScope;
    let donation = { id: 'donation_id', amount: '0.00', motivation: 'a' };
    beforeEach(() => {
        angular.mock.module(modalController);
        inject((
            $controller, $rootScope, _gettextCatalog_, _accounts_, _alerts_, _designationAccounts_, _donations_, _api_
        ) => {
            controller = $controller;
            rootScope = $rootScope;
            scope = $rootScope.$new();
            scope.$hide = () => {};

            api = _api_;
            gettextCatalog = _gettextCatalog_;
            accounts = _accounts_;
            alerts = _alerts_;
            designationAccounts = _designationAccounts_;
            donations = _donations_;

            loadController();
        });
        spyOn(alerts, 'addAlert').and.callFake((data) => data);
        spyOn(gettextCatalog, 'getString').and.callThrough();
        spyOn(rootScope, '$emit').and.callFake(() => {});
    });

    function loadController(data = donation) {
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
                spyOn($ctrl, 'setDesignationAccount').and.returnValue();
            });

            it('should set the initialDonation', () => {
                $ctrl.activate();
                expect($ctrl.setDesignationAccount).toHaveBeenCalled();
            });
        });
    });

    describe('setDesignationAccount', () => {
        it('should set the designation_account', (done) => {
            spyOn(designationAccounts, 'load').and.callFake(() => Promise.resolve([{ id: 'designation_id' }]));
            $ctrl.setDesignationAccount().then(() => {
                expect($ctrl.donation.designation_account).toEqual({ id: 'designation_id' });
                done();
            });
        });
    });

    describe('save', () => {
        describe('promise resolved', () => {
            beforeEach(() => {
                spyOn(donations, 'save').and.callFake((data) => Promise.resolve(data));
                spyOn(scope, '$hide').and.returnValue();
            });

            it('should call donations.save', () => {
                $ctrl.save();
                expect(donations.save).toHaveBeenCalledWith({ id: 'donation_id' });
            });

            it('should hide modal', (done) => {
                $ctrl.save().then(() => {
                    expect(scope.$hide).toHaveBeenCalled();
                    done();
                });
            });

            it('should add a translated alert', (done) => {
                $ctrl.save().then(() => {
                    expect(alerts.addAlert).toHaveBeenCalledWith(jasmine.any(String), 'success');
                    expect(gettextCatalog.getString).toHaveBeenCalled();
                    done();
                });
            });
        });

        describe('promise rejected', () => {
            beforeEach(() => {
                spyOn(donations, 'save').and.callFake(() => Promise.reject(Error('fail')));
            });

            it('should add a translated alert', (done) => {
                $ctrl.save().catch(() => {
                    expect(alerts.addAlert).toHaveBeenCalledWith(jasmine.any(String), 'danger', null, 5, true);
                    expect(gettextCatalog.getString).toHaveBeenCalledWith(jasmine.any(String));
                    done();
                });
            });
        });

        describe('remove appeal', () => {
            beforeEach(() => {
                spyOn(donations, 'save').and.callFake((data) => Promise.resolve(data));
                $ctrl.initialDonation.appeal = { id: 'appeal_id' };
                $ctrl.donation.appeal = null;
            });

            it('should update with empty appeal', (done) => {
                $ctrl.save().then(() => {
                    expect(donations.save).toHaveBeenCalledWith({
                        id: 'donation_id',
                        appeal: { id: 'none' }
                    });
                    done();
                });
            });
        });

        describe('calls save with patch only', () => {
            beforeEach(() => {
                spyOn(donations, 'save').and.callFake((data) => Promise.resolve(data));
                $ctrl.initialDonation
                    = { id: 'donation_id', sameVal: 'value', sameObj: {}, patchVal: null, patchObj: null };
                $ctrl.donation
                    = { id: 'donation_id', sameVal: 'value', sameObj: {}, patchVal: 'value', patchObj: {} };
            });

            it('should update with empty appeal', (done) => {
                $ctrl.save().then(() => {
                    expect(donations.save).toHaveBeenCalledWith({
                        id: 'donation_id',
                        patchVal: 'value',
                        patchObj: {}
                    });
                    done();
                });
            });
        });
    });

    describe('delete', () => {
        describe('promise resolved', () => {
            beforeEach(() => {
                spyOn(donations, 'delete').and.callFake((data) => Promise.resolve(data));
                spyOn(scope, '$hide').and.returnValue();
            });

            it('should call donations.delete', () => {
                $ctrl.delete();
                expect(donations.delete).toHaveBeenCalledWith(donation);
            });

            it('should hide modal', (done) => {
                $ctrl.delete().then(() => {
                    expect(scope.$hide).toHaveBeenCalled();
                    done();
                });
            });

            it('emit to the rootscope', (done) => {
                $ctrl.delete().then(() => {
                    expect(rootScope.$emit).toHaveBeenCalledWith('donationRemoved', { id: donation.id });
                    done();
                });
            });

            it('should add a translated alert', (done) => {
                $ctrl.delete().then(() => {
                    expect(alerts.addAlert).toHaveBeenCalledWith(jasmine.any(String), 'success');
                    expect(gettextCatalog.getString).toHaveBeenCalled();
                    done();
                });
            });
        });

        describe('promise rejected', () => {
            it('should add a translated alert', (done) => {
                spyOn(donations, 'delete').and.callFake(() => Promise.reject(Error('fail')));
                $ctrl.delete().catch(() => {
                    expect(alerts.addAlert).toHaveBeenCalledWith(jasmine.any(String), 'danger', null, 5, true);
                    expect(gettextCatalog.getString).toHaveBeenCalled();
                    done();
                });
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
    });

    describe('search', () => {
        const keywords = 'my keywords';
        beforeEach(() => {
            spyOn(api, 'get').and.callFake((url, data) => Promise.resolve(data));
        });

        it('should return a promise', () => {
            expect($ctrl.search(keywords)).toEqual(jasmine.any(Promise));
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
});
