import component from './connect.component';

describe('setup.connect.component', () => {
    let $ctrl, contacts, rootScope, scope, componentController, api, alerts, gettextCatalog, preferencesOrganization, users;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _accounts_, _help_, _preferencesOrganization_, _serverConstants_, _alerts_, _gettextCatalog_, _api_, _users_) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            alerts = _alerts_;
            api = _api_;
            gettextCatalog = _gettextCatalog_;
            preferencesOrganization = _preferencesOrganization_;
            componentController = $componentController;
            users = _users_;
            api.account_list_id = 1234;
            loadController();
        });
        spyOn(alerts, 'addAlert').and.callFake(data => data);
        spyOn(gettextCatalog, 'getString').and.callFake(data => data);
    });
    function loadController() {
        $ctrl = componentController('setupConnect', {$scope: scope}, {});
    }
    describe('add', () => {
        beforeEach(() => {
            $ctrl.username = 'a';
            $ctrl.password = 'b';
            $ctrl.selectedKey = 'c';
            spyOn(users, 'listOrganizationAccounts').and.callFake(() => Promise.resolve());
        });
        it('should call createAccount', () => {
            spyOn(preferencesOrganization, 'createAccount').and.callFake(() => Promise.resolve());
            $ctrl.add();
            expect(preferencesOrganization.createAccount).toHaveBeenCalledWith('a', 'b', 'c');
        });
        it('should refresh if successful', done => {
            spyOn(preferencesOrganization, 'createAccount').and.callFake(() => Promise.resolve());
            $ctrl.add().then(() => {
                expect(users.listOrganizationAccounts).toHaveBeenCalledWith(true);
                expect($ctrl.connecting).toBeFalsy();
                expect($ctrl.showOrgs).toBeFalsy();
                done();
            });
        });
        it('should alert if rejected', done => {
            spyOn(preferencesOrganization, 'createAccount').and.callFake(() => Promise.reject());
            $ctrl.add().catch(() => {
                expect(alerts.addAlert).toHaveBeenCalledWith(jasmine.any(String), 'danger');
                expect(gettextCatalog.getString).toHaveBeenCalledWith(jasmine.any(String));
                done();
            });
        });
    });
});