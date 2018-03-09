import component from './invites.component';

describe('preferences.coaches.coachesInvites.component', () => {
    let $ctrl, accounts, api, rootScope, scope, componentController, gettextCatalog;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _accounts_, _api_, _gettextCatalog_) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            accounts = _accounts_;
            api = _api_;
            gettextCatalog = _gettextCatalog_;
            componentController = $componentController;
            loadController();
        });
        spyOn(gettextCatalog, 'getString').and.callThrough();
    });

    function loadController() {
        $ctrl = componentController('coachesInvitePreferences', { $scope: scope }, {});
    }

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
            spyOn(api, 'post').and.callFake(() => Promise.resolve([]));
            $ctrl.sendInvite();
            expect($ctrl.saving).toBeTruthy();
        });

        it('should call the api', () => {
            spyOn(api, 'post').and.callFake(() => Promise.resolve([]));
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
            spyOn(api, 'post').and.callFake(() => Promise.resolve([]));
            spyOn(accounts, 'listCoachesInvites').and.callFake(() => Promise.resolve());
            $ctrl.sendInvite().then(() => {
                expect($ctrl.saving).toBeFalsy();
                done();
            });
        });

        it('should reset email', (done) => {
            spyOn(api, 'post').and.callFake(() => Promise.resolve([]));
            spyOn(accounts, 'listCoachesInvites').and.callFake(() => Promise.resolve());
            $ctrl.sendInvite().then(() => {
                expect($ctrl.email).toEqual('');
                done();
            });
        });

        it('should refresh coachesInvites', (done) => {
            spyOn(api, 'post').and.callFake(() => Promise.resolve([]));
            spyOn(accounts, 'listCoachesInvites').and.callFake(() => Promise.resolve());
            $ctrl.sendInvite().then(() => {
                expect(accounts.listCoachesInvites).toHaveBeenCalled();
                done();
            });
        });

        it('should handle rejection', (done) => {
            spyOn(api, 'post').and.callFake(() => Promise.reject([]));
            $ctrl.sendInvite().catch(() => {
                expect($ctrl.saving).toBeFalsy();
                done();
            });
        });
    });
});
