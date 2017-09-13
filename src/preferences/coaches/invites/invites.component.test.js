import component from './invites.component';

describe('preferences.coaches.coachesInvites.component', () => {
    let $ctrl, accounts, coachesInvites, rootScope, scope, componentController, alerts, gettextCatalog;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _accounts_, _coachesInvites_, _alerts_, _gettextCatalog_) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            accounts = _accounts_;
            alerts = _alerts_;
            coachesInvites = _coachesInvites_;
            gettextCatalog = _gettextCatalog_;
            componentController = $componentController;
            loadController();
        });
        spyOn(alerts, 'addAlert').and.callFake((data) => data);
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
        });

        it('should set saving flag', () => {
            $ctrl.sendInvite();
            expect($ctrl.saving).toBeTruthy();
        });

        it('should create an invite', () => {
            spyOn(coachesInvites, 'create').and.callFake(() => Promise.resolve());
            $ctrl.sendInvite();
            expect(coachesInvites.create).toHaveBeenCalledWith('a@b.c');
        });

        it('should unset saving flag', (done) => {
            spyOn(coachesInvites, 'create').and.callFake(() => Promise.resolve());
            spyOn(accounts, 'listCoachesInvites').and.callFake(() => Promise.resolve());
            $ctrl.sendInvite().then(() => {
                expect($ctrl.saving).toBeFalsy();
                done();
            });
        });

        it('should alert a translated confirmation', (done) => {
            spyOn(coachesInvites, 'create').and.callFake(() => Promise.resolve());
            spyOn(accounts, 'listCoachesInvites').and.callFake(() => Promise.resolve());
            $ctrl.sendInvite().then(() => {
                expect(alerts.addAlert).toHaveBeenCalledWith(jasmine.any(String), 'success');
                expect(gettextCatalog.getString).toHaveBeenCalledWith(jasmine.any(String), { email: 'a@b.c' });
                done();
            });
        });

        it('should reset email', (done) => {
            spyOn(coachesInvites, 'create').and.callFake(() => Promise.resolve());
            spyOn(accounts, 'listCoachesInvites').and.callFake(() => Promise.resolve());
            $ctrl.sendInvite().then(() => {
                expect($ctrl.email).toEqual('');
                done();
            });
        });

        it('should refresh coachesInvites', (done) => {
            spyOn(coachesInvites, 'create').and.callFake(() => Promise.resolve());
            spyOn(accounts, 'listCoachesInvites').and.callFake(() => Promise.resolve());
            $ctrl.sendInvite().then(() => {
                expect(accounts.listCoachesInvites).toHaveBeenCalled();
                done();
            });
        });

        it('should handle rejection', (done) => {
            spyOn(coachesInvites, 'create').and.callFake(() => Promise.reject(Error('')));
            $ctrl.sendInvite().catch(() => {
                expect($ctrl.saving).toBeFalsy();
                expect(alerts.addAlert).toHaveBeenCalledWith(jasmine.any(String), 'danger');
                expect(gettextCatalog.getString).toHaveBeenCalledWith(jasmine.any(String));
                done();
            });
        });
    });
});
