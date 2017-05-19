import modalController from './modal.controller';
import isEqual from 'lodash/fp/isEqual';

describe('donation.modal.controller', () => {
    let $ctrl, controller, scope, gettextCatalog, alerts, donations;
    let donation = { id: 'donation_id' };
    beforeEach(() => {
        angular.mock.module(modalController);
        inject(($controller, $rootScope, _gettextCatalog_, _alerts_, _donations_) => {
            controller = $controller;
            scope = $rootScope.$new();
            scope.$hide = () => {};

            gettextCatalog = _gettextCatalog_;
            alerts = _alerts_;
            donations = _donations_;

            loadController();
        });
    });

    function loadController() {
        $ctrl = controller('donationModalController as $ctrl', {
            $scope: scope,
            donation: donation
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
    });

    describe('save', () => {
        describe('promise resolved', () => {
            beforeEach(() => {
                spyOn(donations, 'save').and.callFake((data) => Promise.resolve(data));
                spyOn(scope, '$hide').and.returnValue();
            });

            it('should return a promise', () => {
                expect($ctrl.save()).toEqual(jasmine.any(Promise));
            });

            it('should call donations.save', () => {
                $ctrl.save();
                expect(donations.save).toHaveBeenCalledWith(donation);
            });

            it('should hide modal', (done) => {
                $ctrl.save().then(() => {
                    expect(scope.$hide).toHaveBeenCalled();
                    done();
                });
            });
        });

        describe('promise rejected', () => {
            beforeEach(() => {
                spyOn(donations, 'save').and.callFake(() => Promise.reject(Error('fail')));
                spyOn(alerts, 'addAlert').and.returnValue();
                spyOn(gettextCatalog, 'getString').and.callFake((message) => message);
            });

            it('should add alert', (done) => {
                $ctrl.save().then(() => {
                    expect(alerts.addAlert).toHaveBeenCalledWith('Unable to change donation', 'danger');
                    done();
                });
            });

            it('should translate alert message', (done) => {
                $ctrl.save().then(() => {
                    expect(gettextCatalog.getString).toHaveBeenCalled();
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
                $ctrl.initialDonation =
                    { id: 'donation_id', sameVal: 'value', sameObj: {}, patchVal: null, patchObj: null };
                $ctrl.donation =
                    { id: 'donation_id', sameVal: 'value', sameObj: {}, patchVal: 'value', patchObj: {} };
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

            it('should return a promise', () => {
                expect($ctrl.delete()).toEqual(jasmine.any(Promise));
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
        });

        describe('promise rejected', () => {
            beforeEach(() => {
                spyOn(donations, 'delete').and.callFake(() => Promise.reject(Error('fail')));
                spyOn(alerts, 'addAlert').and.returnValue();
                spyOn(gettextCatalog, 'getString').and.callFake((message) => message);
            });

            it('should add alert', (done) => {
                $ctrl.delete().then(() => {
                    expect(alerts.addAlert).toHaveBeenCalledWith('Unable to remove donation', 'danger');
                    done();
                });
            });

            it('should translate alert message', (done) => {
                $ctrl.delete().then(() => {
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
});
