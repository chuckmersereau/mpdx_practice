import component from './share.component';

describe('preferences.accounts.share', () => {
    let $ctrl, accounts, rootScope, scope, gettextCatalog, q;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _accounts_, _gettextCatalog_, $q) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            accounts = _accounts_;
            gettextCatalog = _gettextCatalog_;
            q = $q;
            $ctrl = $componentController('sharePreferences', { $scope: scope }, { setup: false });
        });
        spyOn(gettextCatalog, 'getString').and.callThrough();
        spyOn(accounts, 'listUsers').and.callFake(() => {});
        spyOn(accounts, 'listInvites').and.callFake(() => {});
    });

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
            spyOn(accounts, 'destroyInvite').and.callFake(() => q.resolve());
            const successMessage = 'MPDX removed the invite successfully';
            const errorMessage = 'MPDX couldn\'t remove the invite';
            $ctrl.cancelInvite(1);
            expect(accounts.destroyInvite).toHaveBeenCalledWith(1, successMessage, errorMessage);
            expect(gettextCatalog.getString).toHaveBeenCalledWith(successMessage);
            expect(gettextCatalog.getString).toHaveBeenCalledWith(errorMessage);
        });

        it('should unset saving flag', (done) => {
            spyOn(accounts, 'destroyInvite').and.callFake(() => q.resolve());
            $ctrl.cancelInvite(1).then(() => {
                expect($ctrl.saving).toBeFalsy();
                done();
            });
            scope.$digest();
        });

        it('should remove the invite', (done) => {
            spyOn(accounts, 'destroyInvite').and.callFake(() => q.resolve());
            $ctrl.cancelInvite(1).then(() => {
                expect(accounts.inviteList).toEqual([{ id: 2 }]);
                done();
            });
            scope.$digest();
        });

        it('should handle rejection', (done) => {
            spyOn(accounts, 'destroyInvite').and.callFake(() => q.reject(Error('')));
            $ctrl.cancelInvite(1).catch(() => {
                expect($ctrl.saving).toBeFalsy();
                done();
            });
            scope.$digest();
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
            spyOn(accounts, 'destroyUser').and.callFake(() => q.resolve());
            const successMessage = 'MPDX removed the user successfully';
            const errorMessage = 'MPDX couldn\'t remove the user';
            $ctrl.removeUser(1);
            expect(accounts.destroyUser).toHaveBeenCalledWith(1, successMessage, errorMessage);
            expect(gettextCatalog.getString).toHaveBeenCalledWith(successMessage);
            expect(gettextCatalog.getString).toHaveBeenCalledWith(errorMessage);
        });

        it('should unset saving flag', (done) => {
            spyOn(accounts, 'destroyUser').and.callFake(() => q.resolve());
            $ctrl.removeUser(1).then(() => {
                expect($ctrl.saving).toBeFalsy();
                done();
            });
            scope.$digest();
        });

        it('should remove the user', (done) => {
            spyOn(accounts, 'destroyUser').and.callFake(() => q.resolve());
            $ctrl.removeUser(1).then(() => {
                expect(accounts.userList).toEqual([{ id: 2 }]);
                done();
            });
            scope.$digest();
        });

        it('should handle rejection', (done) => {
            spyOn(accounts, 'destroyUser').and.callFake(() => q.reject(Error('')));
            $ctrl.removeUser(1).catch(() => {
                expect($ctrl.saving).toBeFalsy();
                done();
            });
            scope.$digest();
        });
    });
});