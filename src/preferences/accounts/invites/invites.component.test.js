import component from './invites.component';

describe('preferences.accounts.invites.component', () => {
    let $ctrl, accounts, invites, rootScope, scope, componentController, alerts, gettextCatalog;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _accounts_, _invites_, _alerts_, _gettextCatalog_) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            accounts = _accounts_;
            alerts = _alerts_;
            invites = _invites_;
            gettextCatalog = _gettextCatalog_;
            componentController = $componentController;
            loadController();
        });
        spyOn(alerts, 'addAlert').and.callFake((data) => data);
        spyOn(gettextCatalog, 'getString').and.callThrough();
    });
    function loadController() {
        $ctrl = componentController('invitePreferences', { $scope: scope }, {});
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
        });
        it('should set saving flag', () => {
            $ctrl.sendInvite();
            expect($ctrl.saving).toBeTruthy();
        });
        it('should create an invite', () => {
            spyOn(invites, 'create').and.callFake(() => Promise.resolve());
            $ctrl.sendInvite();
            expect(invites.create).toHaveBeenCalledWith('a@b.c');
        });
        it('should unset saving flag', (done) => {
            spyOn(invites, 'create').and.callFake(() => Promise.resolve());
            spyOn(accounts, 'listInvites').and.callFake(() => Promise.resolve());
            $ctrl.sendInvite().then(() => {
                expect($ctrl.saving).toBeFalsy();
                done();
            });
        });
        it('should alert a translated confirmation', (done) => {
            spyOn(invites, 'create').and.callFake(() => Promise.resolve());
            spyOn(accounts, 'listInvites').and.callFake(() => Promise.resolve());
            $ctrl.sendInvite().then(() => {
                expect(alerts.addAlert).toHaveBeenCalledWith(jasmine.any(String), 'success');
                expect(gettextCatalog.getString).toHaveBeenCalledWith(jasmine.any(String), { email: 'a@b.c' });
                done();
            });
        });
        it('should reset email', (done) => {
            spyOn(invites, 'create').and.callFake(() => Promise.resolve());
            spyOn(accounts, 'listInvites').and.callFake(() => Promise.resolve());
            $ctrl.sendInvite().then(() => {
                expect($ctrl.email).toEqual('');
                done();
            });
        });
        it('should refresh invites', (done) => {
            spyOn(invites, 'create').and.callFake(() => Promise.resolve());
            spyOn(accounts, 'listInvites').and.callFake(() => Promise.resolve());
            $ctrl.sendInvite().then(() => {
                expect(accounts.listInvites).toHaveBeenCalled();
                done();
            });
        });
        it('should handle rejection', (done) => {
            spyOn(invites, 'create').and.callFake(() => Promise.reject(Error('')));
            $ctrl.sendInvite().catch(() => {
                expect($ctrl.saving).toBeFalsy();
                expect(alerts.addAlert).toHaveBeenCalledWith(jasmine.any(String), 'danger');
                expect(gettextCatalog.getString).toHaveBeenCalledWith(jasmine.any(String));
                done();
            });
        });
    });
});