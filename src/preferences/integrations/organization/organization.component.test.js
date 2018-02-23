import component from './organization.component';

describe('preferences.organization.component', () => {
    let $ctrl, rootScope, scope, componentController,
        gettextCatalog,
        alerts, modal, preferencesOrganization, serverConstants, users;

    beforeEach(() => {
        angular.mock.module(component);
        inject((
            $componentController, $rootScope,
            _gettextCatalog_,
            _alerts_, _modal_, _preferencesOrganization_, _serverConstants_, _users_
        ) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            gettextCatalog = _gettextCatalog_;
            alerts = _alerts_;
            modal = _modal_;
            preferencesOrganization = _preferencesOrganization_;
            serverConstants = _serverConstants_;
            users = _users_;
            componentController = $componentController;
            loadController();
        });
        spyOn(alerts, 'addAlert').and.callFake((data) => data);
        spyOn(gettextCatalog, 'getString').and.callThrough();
    });

    function loadController() {
        $ctrl = componentController('organizationIntegrationPreferences', { $scope: scope }, {});
    }
    describe('constructor', () => {
        it('should set default values', () => {
            expect($ctrl.saving).toBeFalsy();
            expect($ctrl.page).toEqual('org_list');
            expect($ctrl.selected).toEqual(null);
            expect($ctrl.username).toEqual(null);
            expect($ctrl.password).toEqual(null);
        });
    });
    describe('$onInit', () => {
        it('should call listOrganizationAccounts', () => {
            spyOn(users, 'listOrganizationAccounts').and.callFake(() => Promise.resolve());
            $ctrl.$onInit();
            expect(users.listOrganizationAccounts).toHaveBeenCalled();
        });
        describe('accountListUpdated event', () => {
            it('should call listOrganizationAccounts when event accountListUpdated triggered', () => {
                $ctrl.$onInit();
                spyOn(users, 'listOrganizationAccounts').and.callFake(() => Promise.resolve());
                rootScope.$emit('accountListUpdated');
                expect(users.listOrganizationAccounts).toHaveBeenCalledWith(true);
            });
        });
    });
    describe('save', () => {
        beforeEach(() => {
            spyOn(users, 'listOrganizationAccounts').and.callFake(() => Promise.resolve());
        });
        it('should set saving flag', () => {
            spyOn(preferencesOrganization, 'save').and.callFake(() => Promise.resolve());
            $ctrl.save();
            expect($ctrl.saving).toBeTruthy();
        });
        it('should save', () => {
            spyOn(preferencesOrganization, 'save').and.callFake(() => Promise.resolve());
            const successMessage = 'Preferences saved successfully';
            const errorMessage = 'Unable to save preferences';
            $ctrl.save();
            expect(gettextCatalog.getString).toHaveBeenCalledWith(successMessage);
            expect(gettextCatalog.getString).toHaveBeenCalledWith(errorMessage);
            expect(preferencesOrganization.save).toHaveBeenCalledWith(successMessage, errorMessage);
        });
        it('should unset saving flag', (done) => {
            spyOn(preferencesOrganization, 'save').and.callFake(() => Promise.resolve());
            $ctrl.save().then(() => {
                expect($ctrl.saving).toBeFalsy();
                done();
            });
        });
        it('should set showSettings false', (done) => {
            spyOn(preferencesOrganization, 'save').and.callFake(() => Promise.resolve());
            $ctrl.save().then(() => {
                expect($ctrl.showSettings).toBeFalsy();
                done();
            });
        });
        it('should refresh', (done) => {
            spyOn(preferencesOrganization, 'save').and.callFake(() => Promise.resolve());
            $ctrl.save().then(() => {
                expect(users.listOrganizationAccounts).toHaveBeenCalledWith(true);
                done();
            });
        });
        it('should handle rejection', (done) => {
            spyOn(preferencesOrganization, 'save').and.callFake(() => Promise.reject({ errors: ['a'] }));
            $ctrl.save().catch(() => {
                expect($ctrl.saving).toBeFalsy();
                done();
            });
        });
    });
    describe('disconnect', () => {
        beforeEach(() => {
            spyOn(users, 'listOrganizationAccounts').and.callFake(() => Promise.resolve());
        });
        it('should disconnect', (done) => {
            spyOn(preferencesOrganization, 'disconnect').and.callFake(() => Promise.resolve());
            const errorMessage = 'MPDX couldn\'t save your configuration changes for that organization';
            const successMessage = 'MPDX removed your organization integration';
            $ctrl.disconnect(1).then(() => {
                expect(preferencesOrganization.disconnect).toHaveBeenCalledWith(1, successMessage, errorMessage);
                expect(gettextCatalog.getString).toHaveBeenCalledWith(errorMessage);
                expect(gettextCatalog.getString).toHaveBeenCalledWith(successMessage);
                done();
            });
        });
        it('should unset saving flag', (done) => {
            spyOn(preferencesOrganization, 'disconnect').and.callFake(() => Promise.resolve());
            $ctrl.disconnect(1).then(() => {
                expect($ctrl.saving).toBeFalsy();
                done();
            });
        });
        it('should refresh', (done) => {
            spyOn(preferencesOrganization, 'disconnect').and.callFake(() => Promise.resolve());
            $ctrl.disconnect(1).then(() => {
                expect(users.listOrganizationAccounts).toHaveBeenCalledWith(true);
                done();
            });
        });
        it('should handle rejection', (done) => {
            spyOn(preferencesOrganization, 'disconnect').and.callFake(() => Promise.reject());
            $ctrl.disconnect(1).catch(() => {
                expect($ctrl.saving).toBeFalsy();
                done();
            });
        });
    });
    describe('createAccount', () => {
        beforeEach(() => {
            $ctrl.username = 'a';
            $ctrl.password = 'b';
            $ctrl.selectedKey = 'c';
        });
        it('should set saving flag', () => {
            spyOn(preferencesOrganization, 'createAccount').and.callFake(() => Promise.resolve());
            $ctrl.createAccount();
            expect($ctrl.saving).toBeTruthy();
        });
        it('should create an account', () => {
            spyOn(preferencesOrganization, 'createAccount').and.callFake(() => Promise.resolve());
            const errorMessage = 'Unable to add your organization account';
            const successMessage = 'MPDX added your organization account';
            $ctrl.createAccount();
            expect(gettextCatalog.getString).toHaveBeenCalledWith(errorMessage);
            expect(gettextCatalog.getString).toHaveBeenCalledWith(successMessage);
            expect(preferencesOrganization.createAccount).toHaveBeenCalledWith('a', 'b', 'c', successMessage, errorMessage);
        });
        it('should unset saving flag', (done) => {
            spyOn(preferencesOrganization, 'createAccount').and.callFake(() => Promise.resolve());
            $ctrl.createAccount().then(() => {
                expect($ctrl.saving).toBeFalsy();
                done();
            });
        });
        it('should handle rejection', (done) => {
            spyOn(preferencesOrganization, 'createAccount').and.callFake(() => Promise.reject({ errors: ['a'] }));
            $ctrl.createAccount().catch(() => {
                expect($ctrl.saving).toBeFalsy();
                done();
            });
        });
    });
    describe('updateAccount', () => {
        beforeEach(() => {
            $ctrl.username = 'a';
            $ctrl.password = 'b';
            $ctrl.selectedKey = 'c';
            users.current = { id: 1 };
            $ctrl.selected = { id: 2 };
            spyOn(users, 'listOrganizationAccounts').and.callFake(() => Promise.resolve());
            spyOn($ctrl, 'revert').and.callFake(() => Promise.resolve());
        });
        it('should set saving flag', () => {
            spyOn(preferencesOrganization, 'updateAccount').and.callFake(() => Promise.resolve());
            $ctrl.updateAccount();
            expect($ctrl.saving).toBeTruthy();
        });
        it('should update an account', () => {
            spyOn(preferencesOrganization, 'updateAccount').and.callFake(() => Promise.resolve());
            const successMessage = 'MPDX updated your organization account';
            const errorMessage = 'Unable to update your organization account';
            $ctrl.updateAccount();
            expect(preferencesOrganization.updateAccount).toHaveBeenCalledWith('a', 'b', 2, successMessage, errorMessage);
            expect(gettextCatalog.getString).toHaveBeenCalledWith(successMessage);
            expect(gettextCatalog.getString).toHaveBeenCalledWith(errorMessage);
        });
        it('should unset saving flag', (done) => {
            spyOn(preferencesOrganization, 'createAccount').and.callFake(() => Promise.resolve());
            $ctrl.createAccount().then(() => {
                expect($ctrl.saving).toBeFalsy();
                done();
            });
        });
        it('should refresh', (done) => {
            spyOn(preferencesOrganization, 'updateAccount').and.callFake(() => Promise.resolve());
            $ctrl.updateAccount().then(() => {
                expect(users.listOrganizationAccounts).toHaveBeenCalledWith(true);
                done();
            });
        });
        it('should revert fields', (done) => {
            spyOn(preferencesOrganization, 'updateAccount').and.callFake(() => Promise.resolve());
            $ctrl.updateAccount().then(() => {
                expect($ctrl.revert).toHaveBeenCalledWith();
                done();
            });
        });
        it('should handle rejection', (done) => {
            spyOn(preferencesOrganization, 'updateAccount').and.callFake(() => Promise.reject({ errors: ['a'] }));
            $ctrl.updateAccount().catch(() => {
                expect($ctrl.saving).toBeFalsy();
                done();
            });
        });
    });
    describe('import', () => {
        const account = { id: 1 };
        beforeEach(() => {
            account.organization = { name: 'a' };
            spyOn(modal, 'info').and.callFake(() => Promise.resolve());
        });
        it('should set importing flag', () => {
            spyOn(preferencesOrganization, 'import').and.callFake(() => Promise.resolve());
            $ctrl.import(account);
            expect($ctrl.importing).toBeTruthy();
        });
        it('should importing', () => {
            spyOn(preferencesOrganization, 'import').and.callFake(() => Promise.resolve());
            $ctrl.import(account);
            expect(preferencesOrganization.import).toHaveBeenCalledWith(account);
        });
        it('should unset importing flag', (done) => {
            spyOn(preferencesOrganization, 'import').and.callFake(() => Promise.resolve());
            $ctrl.import(account).then(() => {
                expect($ctrl.importing).toBeFalsy();
                done();
            });
        });
        it('should unset showTntDataSync flag', (done) => {
            spyOn(preferencesOrganization, 'import').and.callFake(() => Promise.resolve());
            $ctrl.import(account).then(() => {
                expect($ctrl.showTntDataSync).toBeFalsy();
                done();
            });
        });
        it('should alert a translated confirmation', (done) => {
            spyOn(preferencesOrganization, 'import').and.callFake(() => Promise.resolve());
            $ctrl.import(account).then(() => {
                expect(modal.info).toHaveBeenCalledWith(jasmine.any(String), 'success');
                expect(gettextCatalog.getString).toHaveBeenCalledWith(jasmine.any(String), { name: 'a' }, null);
                done();
            });
        });
        it('should reset file', (done) => {
            spyOn(preferencesOrganization, 'import').and.callFake(() => Promise.resolve());
            $ctrl.import(account).then(() => {
                expect(account.file).toEqual(null);
                done();
            });
        });
        it('should handle rejection', (done) => {
            spyOn(preferencesOrganization, 'import').and.callFake(() => Promise.reject({ errors: ['a'] }));
            $ctrl.import(account).catch(() => {
                expect($ctrl.importing).toBeFalsy();
                expect(account.file).toEqual(null);
                expect(alerts.addAlert).toHaveBeenCalledWith(jasmine.any(String), 'danger');
                expect(gettextCatalog.getString).toHaveBeenCalledWith(jasmine.any(String));
                done();
            });
        });
    });
    describe('select', () => {
        beforeEach(() => {
            serverConstants.data = {
                organizations_attributes: {
                    'org_1': {
                        'key': 'value'
                    }
                }
            };
            $ctrl.selectedKey = 'org_1';
        });
        it('should set selected', () => {
            $ctrl.select();
            expect($ctrl.selected).toEqual({ 'key': 'value' });
        });
    });
});
