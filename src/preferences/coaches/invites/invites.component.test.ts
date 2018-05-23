import component from './invites.component';

describe('preferences.coaches.coachesInvites.component', () => {
    let $ctrl, accounts, api, rootScope, scope, gettextCatalog, q;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _accounts_, _api_, _gettextCatalog_, $q) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            accounts = _accounts_;
            api = _api_;
            gettextCatalog = _gettextCatalog_;
            q = $q;
            $ctrl = $componentController('coachesInvitePreferences', { $scope: scope }, {});
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
            api.account_list_id = 123;
        });

        it('should set saving flag', () => {
            spyOn(api, 'post').and.callFake(() => q.resolve([]));
            $ctrl.sendInvite();
            expect($ctrl.saving).toBeTruthy();
        });

        it('should call the api', () => {
            spyOn(api, 'post').and.callFake(() => q.resolve([]));
            const errorMessage = 'MPDX couldn\'t send an invite (check to see if email address is valid)';
            $ctrl.sendInvite();
            expect(gettextCatalog.getString).toHaveBeenCalledWith('MPDX sent an invite to {{email}}', { email: 'a@b.c' });
            expect(gettextCatalog.getString).toHaveBeenCalledWith(errorMessage);
            expect(api.post).toHaveBeenCalledWith({
                url: 'account_lists/123/invites',
                data: { recipient_email: 'a@b.c', invite_user_as: 'coach' },
                type: 'account_list_invites',
                successMessage: 'MPDX sent an invite to a@b.c',
                errorMessage: errorMessage
            });
        });

        it('should unset saving flag', (done) => {
            spyOn(api, 'post').and.callFake(() => q.resolve([]));
            spyOn(accounts, 'listCoachesInvites').and.callFake(() => q.resolve());
            $ctrl.sendInvite().then(() => {
                expect($ctrl.saving).toBeFalsy();
                done();
            });
            scope.$digest();
        });

        it('should reset email', (done) => {
            spyOn(api, 'post').and.callFake(() => q.resolve([]));
            spyOn(accounts, 'listCoachesInvites').and.callFake(() => q.resolve());
            $ctrl.sendInvite().then(() => {
                expect($ctrl.email).toEqual('');
                done();
            });
            scope.$digest();
        });

        it('should refresh coachesInvites', (done) => {
            spyOn(api, 'post').and.callFake(() => q.resolve([]));
            spyOn(accounts, 'listCoachesInvites').and.callFake(() => q.resolve());
            $ctrl.sendInvite().then(() => {
                expect(accounts.listCoachesInvites).toHaveBeenCalled();
                done();
            });
            scope.$digest();
        });

        it('should handle rejection', (done) => {
            spyOn(api, 'post').and.callFake(() => q.reject([]));
            $ctrl.sendInvite().catch(() => {
                expect($ctrl.saving).toBeFalsy();
                done();
            });
            scope.$digest();
        });
    });
});
