import component from './invites.component';

describe('preferences.accounts.invites.component', () => {
    let $ctrl, accounts, invites, rootScope, scope, gettextCatalog, q;

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _accounts_, _invites_, _gettextCatalog_, $q) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            accounts = _accounts_;
            invites = _invites_;
            gettextCatalog = _gettextCatalog_;
            q = $q;
            $ctrl = $componentController('invitePreferences', { $scope: scope }, {});
        });
        spyOn(gettextCatalog, 'getString').and.callThrough();
    });

    describe('constructor', () => {
        it('should set default values', () => {
            expect($ctrl.saving).toBeFalsy();
            expect($ctrl.email).toEqual('');
        });
    });

    describe('sendInvite', () => {
        beforeEach(() => {
            $ctrl.email = 'a@b.c';
        });

        it('should set saving flag', () => {
            $ctrl.sendInvite();
            expect($ctrl.saving).toBeTruthy();
        });

        it('should create an invite', () => {
            spyOn(invites, 'create').and.callFake(() => q.resolve());
            const successMessage = 'MPDX sent an invite to a@b.c';
            const errorMessage = 'MPDX couldn\'t send an invite (check to see if email address is valid)';

            $ctrl.sendInvite();
            expect(invites.create).toHaveBeenCalledWith('a@b.c', successMessage, errorMessage);
            expect(gettextCatalog.getString).toHaveBeenCalledWith(errorMessage);
            expect(gettextCatalog.getString).toHaveBeenCalledWith('MPDX sent an invite to {{email}}', { email: 'a@b.c' });
        });

        it('should unset saving flag', (done) => {
            spyOn(invites, 'create').and.callFake(() => q.resolve());
            spyOn(accounts, 'listInvites').and.callFake(() => q.resolve());
            $ctrl.sendInvite().then(() => {
                expect($ctrl.saving).toBeFalsy();
                done();
            });
            scope.$digest();
        });

        it('should reset email', (done) => {
            spyOn(invites, 'create').and.callFake(() => q.resolve());
            spyOn(accounts, 'listInvites').and.callFake(() => q.resolve());
            $ctrl.sendInvite().then(() => {
                expect($ctrl.email).toEqual('');
                done();
            });
            scope.$digest();
        });

        it('should refresh invites', (done) => {
            spyOn(invites, 'create').and.callFake(() => q.resolve());
            spyOn(accounts, 'listInvites').and.callFake(() => q.resolve());
            $ctrl.sendInvite().then(() => {
                expect(accounts.listInvites).toHaveBeenCalled();
                done();
            });
            scope.$digest();
        });
    });
});
