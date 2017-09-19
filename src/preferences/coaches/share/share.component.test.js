import component from './share.component';

describe('preferences.coaches.share', () => {
    let $ctrl, accounts, rootScope, scope, componentController, alerts, gettextCatalog;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _accounts_, _alerts_, _gettextCatalog_) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            accounts = _accounts_;
            alerts = _alerts_;
            gettextCatalog = _gettextCatalog_;
            componentController = $componentController;
            loadController();
        });
        spyOn(alerts, 'addAlert').and.callFake((data) => data);
        spyOn(gettextCatalog, 'getString').and.callThrough();
        spyOn(accounts, 'listCoaches').and.callFake(() => {});
        spyOn(accounts, 'listCoachesInvites').and.callFake(() => {});
    });

    function loadController() {
        $ctrl = componentController('coachesSharePreferences', { $scope: scope }, { setup: false });
    }

    describe('constructor', () => {
        it('should set default values', () => {
            expect($ctrl.saving).toBeFalsy();
            expect($ctrl.inviteEmail).toEqual('');
        });
    });

    describe('$onInit', () => {
        beforeEach(() => {
            $ctrl.setup = false;
        });

        it('shouldn\'t run services on setup', () => {
            $ctrl.setup = true;
            $ctrl.$onInit();
            expect(accounts.listCoaches).not.toHaveBeenCalled();
        });

        it('should call services if not in setup', () => {
            $ctrl.$onInit();
            expect(accounts.listCoaches).toHaveBeenCalled();
            expect(accounts.listCoachesInvites).toHaveBeenCalled();
        });
    });

    describe('events', () => {
        beforeEach(() => {
            $ctrl.$onInit();
        });
        // x'd until Org_acct is fixed
        xit('should call services if account list changes out of setup', () => {
            rootScope.$emit('accountListUpdated');
            rootScope.$digest();
            expect(accounts.listCoaches).toHaveBeenCalled();
            expect(accounts.listCoachesInvites).toHaveBeenCalled();
        });
    });

    describe('removeCoachInvite', () => {
        beforeEach(() => {
            accounts.inviteCoachList = [{ id: 1 }, { id: 2 }];
        });

        it('should set saving flag', () => {
            $ctrl.removeCoachInvite(1);
            expect($ctrl.saving).toBeTruthy();
        });

        it('should destroy an invite', () => {
            spyOn(accounts, 'destroyInvite').and.callFake(() => Promise.resolve());
            $ctrl.removeCoachInvite(1);
            expect(accounts.destroyInvite).toHaveBeenCalledWith(1);
        });

        it('should unset saving flag', (done) => {
            spyOn(accounts, 'destroyInvite').and.callFake(() => Promise.resolve());
            $ctrl.removeCoachInvite(1).then(() => {
                expect($ctrl.saving).toBeFalsy();
                done();
            });
        });

        it('should alert a translated confirmation', (done) => {
            spyOn(accounts, 'destroyInvite').and.callFake(() => Promise.resolve());
            $ctrl.removeCoachInvite(1).then(() => {
                expect(alerts.addAlert).toHaveBeenCalledWith(jasmine.any(String));
                expect(gettextCatalog.getString).toHaveBeenCalledWith(jasmine.any(String));
                done();
            });
        });
        it('should remove the invite', (done) => {
            spyOn(accounts, 'destroyInvite').and.callFake(() => Promise.resolve());
            $ctrl.removeCoachInvite(1).then(() => {
                expect(accounts.inviteCoachList).toEqual([{ id: 2 }]);
                done();
            });
        });

        it('should handle rejection', (done) => {
            spyOn(accounts, 'destroyInvite').and.callFake(() => Promise.reject(Error('')));
            $ctrl.removeCoachInvite(1).catch(() => {
                expect($ctrl.saving).toBeFalsy();
                expect(alerts.addAlert).toHaveBeenCalledWith(jasmine.any(String), 'danger');
                expect(gettextCatalog.getString).toHaveBeenCalledWith(jasmine.any(String));
                done();
            });
        });
    });
    describe('removeCoach', () => {
        beforeEach(() => {
            accounts.coachList = [{ id: 1 }, { id: 2 }];
        });

        it('should set saving flag', () => {
            $ctrl.removeCoach(1);
            expect($ctrl.saving).toBeTruthy();
        });

        it('should remove a user', () => {
            spyOn(accounts, 'destroyCoach').and.callFake(() => Promise.resolve());
            $ctrl.removeCoach(1);
            expect(accounts.destroyCoach).toHaveBeenCalledWith(1);
        });

        it('should unset saving flag', (done) => {
            spyOn(accounts, 'destroyCoach').and.callFake(() => Promise.resolve());
            $ctrl.removeCoach(1).then(() => {
                expect($ctrl.saving).toBeFalsy();
                done();
            });
        });

        it('should alert a translated confirmation', (done) => {
            spyOn(accounts, 'destroyCoach').and.callFake(() => Promise.resolve());
            $ctrl.removeCoach(1).then(() => {
                expect(alerts.addAlert).toHaveBeenCalledWith(jasmine.any(String));
                expect(gettextCatalog.getString).toHaveBeenCalledWith(jasmine.any(String));
                done();
            });
        });

        it('should remove the user', (done) => {
            spyOn(accounts, 'destroyCoach').and.callFake(() => Promise.resolve());
            $ctrl.removeCoach(1).then(() => {
                expect(accounts.coachList).toEqual([{ id: 2 }]);
                done();
            });
        });

        it('should handle rejection', (done) => {
            spyOn(accounts, 'destroyCoach').and.callFake(() => Promise.reject(Error('')));
            $ctrl.removeCoach(1).catch(() => {
                expect($ctrl.saving).toBeFalsy();
                expect(alerts.addAlert).toHaveBeenCalledWith(jasmine.any(String), 'danger');
                expect(gettextCatalog.getString).toHaveBeenCalledWith(jasmine.any(String));
                done();
            });
        });
    });
});
