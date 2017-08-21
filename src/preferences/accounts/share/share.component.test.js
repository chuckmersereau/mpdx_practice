import component from './share.component';

describe('preferences.accounts.share', () => {
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
        spyOn(accounts, 'listUsers').and.callFake(() => {});
        spyOn(accounts, 'listInvites').and.callFake(() => {});
    });
    function loadController() {
        $ctrl = componentController('sharePreferences', { $scope: scope }, { setup: false });
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
            expect(accounts.listUsers).not.toHaveBeenCalled();
        });
        it('should call services if not in setup', () => {
            $ctrl.$onInit();
            expect(accounts.listUsers).toHaveBeenCalled();
            expect(accounts.listInvites).toHaveBeenCalled();
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
            expect(accounts.listUsers).toHaveBeenCalled();
            expect(accounts.listInvites).toHaveBeenCalled();
        });
    });
    describe('cancelInvite', () => {
        beforeEach(() => {
            accounts.inviteList = [{ id: 1 }, { id: 2 }];
        });
        it('should set saving flag', () => {
            $ctrl.cancelInvite(1);
            expect($ctrl.saving).toBeTruthy();
        });
        it('should destroy an invite', () => {
            spyOn(accounts, 'destroyInvite').and.callFake(() => Promise.resolve());
            $ctrl.cancelInvite(1);
            expect(accounts.destroyInvite).toHaveBeenCalledWith(1);
        });
        it('should unset saving flag', (done) => {
            spyOn(accounts, 'destroyInvite').and.callFake(() => Promise.resolve());
            $ctrl.cancelInvite(1).then(() => {
                expect($ctrl.saving).toBeFalsy();
                done();
            });
        });
        it('should alert a translated confirmation', (done) => {
            spyOn(accounts, 'destroyInvite').and.callFake(() => Promise.resolve());
            $ctrl.cancelInvite(1).then(() => {
                expect(alerts.addAlert).toHaveBeenCalledWith(jasmine.any(String));
                expect(gettextCatalog.getString).toHaveBeenCalledWith(jasmine.any(String));
                done();
            });
        });
        it('should remove the invite', (done) => {
            spyOn(accounts, 'destroyInvite').and.callFake(() => Promise.resolve());
            $ctrl.cancelInvite(1).then(() => {
                expect(accounts.inviteList).toEqual([{ id: 2 }]);
                done();
            });
        });
        it('should handle rejection', (done) => {
            spyOn(accounts, 'destroyInvite').and.callFake(() => Promise.reject(Error('')));
            $ctrl.cancelInvite(1).catch(() => {
                expect($ctrl.saving).toBeFalsy();
                expect(alerts.addAlert).toHaveBeenCalledWith(jasmine.any(String), 'danger');
                expect(gettextCatalog.getString).toHaveBeenCalledWith(jasmine.any(String));
                done();
            });
        });
    });
    describe('removeUser', () => {
        beforeEach(() => {
            accounts.userList = [{ id: 1 }, { id: 2 }];
        });
        it('should set saving flag', () => {
            $ctrl.removeUser(1);
            expect($ctrl.saving).toBeTruthy();
        });
        it('should remove a user', () => {
            spyOn(accounts, 'destroyUser').and.callFake(() => Promise.resolve());
            $ctrl.removeUser(1);
            expect(accounts.destroyUser).toHaveBeenCalledWith(1);
        });
        it('should unset saving flag', (done) => {
            spyOn(accounts, 'destroyUser').and.callFake(() => Promise.resolve());
            $ctrl.removeUser(1).then(() => {
                expect($ctrl.saving).toBeFalsy();
                done();
            });
        });
        it('should alert a translated confirmation', (done) => {
            spyOn(accounts, 'destroyUser').and.callFake(() => Promise.resolve());
            $ctrl.removeUser(1).then(() => {
                expect(alerts.addAlert).toHaveBeenCalledWith(jasmine.any(String));
                expect(gettextCatalog.getString).toHaveBeenCalledWith(jasmine.any(String));
                done();
            });
        });
        it('should remove the user', (done) => {
            spyOn(accounts, 'destroyUser').and.callFake(() => Promise.resolve());
            $ctrl.removeUser(1).then(() => {
                expect(accounts.userList).toEqual([{ id: 2 }]);
                done();
            });
        });
        it('should handle rejection', (done) => {
            spyOn(accounts, 'destroyUser').and.callFake(() => Promise.reject(Error('')));
            $ctrl.removeUser(1).catch(() => {
                expect($ctrl.saving).toBeFalsy();
                expect(alerts.addAlert).toHaveBeenCalledWith(jasmine.any(String), 'danger');
                expect(gettextCatalog.getString).toHaveBeenCalledWith(jasmine.any(String));
                done();
            });
        });
    });
});