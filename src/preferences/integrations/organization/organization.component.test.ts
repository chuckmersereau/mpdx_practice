import component from './organization.component';

describe('preferences.organization.component', () => {
    let $ctrl, rootScope, scope, componentController,
        gettextCatalog,
        alerts, modal, preferencesOrganization, serverConstants, users, q;

    beforeEach(() => {
        angular.mock.module(component);
        inject((
            $componentController, $rootScope, $q,
            _gettextCatalog_,
            _alerts_, _modal_, _preferencesOrganization_, _serverConstants_, _users_
        ) => {
            rootScope = $rootScope;
            q = $q;
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
            spyOn(users, 'listOrganizationAccounts').and.callFake(() => q.resolve());
            $ctrl.$onInit();
            expect(users.listOrganizationAccounts).toHaveBeenCalled();
        });
        describe('accountListUpdated event', () => {
            it('should call listOrganizationAccounts when event accountListUpdated triggered', () => {
                $ctrl.$onInit();
                spyOn(users, 'listOrganizationAccounts').and.callFake(() => q.resolve());
                rootScope.$emit('accountListUpdated');
                expect(users.listOrganizationAccounts).toHaveBeenCalledWith(true);
            });
        });
    });
    describe('save', () => {
        beforeEach(() => {
            spyOn(users, 'listOrganizationAccounts').and.callFake(() => q.resolve());
        });
        it('should set saving flag', () => {
            spyOn(preferencesOrganization, 'save').and.callFake(() => q.resolve());
            $ctrl.save();
            expect($ctrl.saving).toBeTruthy();
            scope.$digest();
        });
        it('should save', () => {
            spyOn(preferencesOrganization, 'save').and.callFake(() => q.resolve());
            const successMessage = 'Preferences saved successfully';
            const errorMessage = 'Unable to save preferences';
            $ctrl.save();
            expect(gettextCatalog.getString).toHaveBeenCalledWith(successMessage);
            expect(gettextCatalog.getString).toHaveBeenCalledWith(errorMessage);
            expect(preferencesOrganization.save).toHaveBeenCalledWith(successMessage, errorMessage);
            scope.$digest();
        });
        it('should unset saving flag', (done) => {
            spyOn(preferencesOrganization, 'save').and.callFake(() => q.resolve());
            $ctrl.save().then(() => {
                expect($ctrl.saving).toBeFalsy();
                done();
            });
            rootScope.$digest();
        });
        it('should set showSettings false', (done) => {
            spyOn(preferencesOrganization, 'save').and.callFake(() => q.resolve());
            $ctrl.save().then(() => {
                expect($ctrl.showSettings).toBeFalsy();
                done();
            });
            scope.$digest();
        });
        it('should refresh', (done) => {
            spyOn(preferencesOrganization, 'save').and.callFake(() => q.resolve());
            $ctrl.save().then(() => {
                expect(users.listOrganizationAccounts).toHaveBeenCalledWith(true);
                done();
            });
            scope.$digest();
        });
        it('should handle rejection', (done) => {
            spyOn(preferencesOrganization, 'save').and.callFake(() => q.reject({ errors: ['a'] }));
            $ctrl.save().catch(() => {
                expect($ctrl.saving).toBeFalsy();
                done();
            });
            scope.$digest();
        });
    });
    describe('disconnect', () => {
        beforeEach(() => {
            spyOn(users, 'listOrganizationAccounts').and.callFake(() => q.resolve());
        });
        it('should disconnect', (done) => {
            spyOn(preferencesOrganization, 'disconnect').and.callFake(() => q.resolve());
            const errorMessage = 'MPDX couldn\'t save your configuration changes for that organization';
            const successMessage = 'MPDX removed your organization integration';
            $ctrl.disconnect(1).then(() => {
                expect(preferencesOrganization.disconnect).toHaveBeenCalledWith(1, successMessage, errorMessage);
                expect(gettextCatalog.getString).toHaveBeenCalledWith(errorMessage);
                expect(gettextCatalog.getString).toHaveBeenCalledWith(successMessage);
                done();
            });
            scope.$digest();
        });
        it('should unset saving flag', (done) => {
            spyOn(preferencesOrganization, 'disconnect').and.callFake(() => q.resolve());
            $ctrl.disconnect(1).then(() => {
                expect($ctrl.saving).toBeFalsy();
                done();
            });
            scope.$digest();
        });
        it('should refresh', (done) => {
            spyOn(preferencesOrganization, 'disconnect').and.callFake(() => q.resolve());
            $ctrl.disconnect(1).then(() => {
                expect(users.listOrganizationAccounts).toHaveBeenCalledWith(true);
                done();
            });
            scope.$digest();
        });
        it('should handle rejection', (done) => {
            spyOn(preferencesOrganization, 'disconnect').and.callFake(() => q.reject());
            $ctrl.disconnect(1).catch(() => {
                expect($ctrl.saving).toBeFalsy();
                done();
            });
            scope.$digest();
        });
    });
    describe('createAccount', () => {
        beforeEach(() => {
            $ctrl.username = 'a';
            $ctrl.password = 'b';
            $ctrl.selectedKey = 'c';
            spyOn(users, 'listOrganizationAccounts').and.callFake(() => q.resolve());
        });
        it('should set saving flag', () => {
            spyOn(preferencesOrganization, 'createAccount').and.callFake(() => q.resolve());
            $ctrl.createAccount();
            expect($ctrl.saving).toBeTruthy();
        });
        it('should create an account', () => {
            spyOn(preferencesOrganization, 'createAccount').and.callFake(() => q.resolve());
            const errorMessage = 'Unable to add your organization account';
            const successMessage = 'MPDX added your organization account';
            $ctrl.createAccount();
            expect(gettextCatalog.getString).toHaveBeenCalledWith(errorMessage);
            expect(gettextCatalog.getString).toHaveBeenCalledWith(successMessage);
            expect(preferencesOrganization.createAccount).toHaveBeenCalledWith('a', 'b', 'c', successMessage, errorMessage);
        });
        it('should unset saving flag', (done) => {
            spyOn(preferencesOrganization, 'createAccount').and.callFake(() => q.resolve());
            $ctrl.createAccount().then(() => {
                expect($ctrl.saving).toBeFalsy();
                done();
            });
            scope.$digest();
        });
        it('should handle rejection', (done) => {
            spyOn(preferencesOrganization, 'createAccount').and.callFake(() => q.reject({ errors: ['a'] }));
            $ctrl.createAccount().catch(() => {
                expect($ctrl.saving).toBeFalsy();
                done();
            });
            scope.$digest();
        });
    });
    describe('updateAccount', () => {
        beforeEach(() => {
            $ctrl.username = 'a';
            $ctrl.password = 'b';
            $ctrl.selectedKey = 'c';
            users.current = { id: 1 };
            $ctrl.selected = { id: 2 };
            spyOn(users, 'listOrganizationAccounts').and.callFake(() => q.resolve());
            spyOn($ctrl, 'revert').and.callFake(() => q.resolve());
        });
        it('should set saving flag', () => {
            spyOn(preferencesOrganization, 'updateAccount').and.callFake(() => q.resolve());
            $ctrl.updateAccount();
            expect($ctrl.saving).toBeTruthy();
        });
        it('should update an account', () => {
            spyOn(preferencesOrganization, 'updateAccount').and.callFake(() => q.resolve());
            const successMessage = 'MPDX updated your organization account';
            const errorMessage = 'Unable to update your organization account';
            $ctrl.updateAccount();
            expect(preferencesOrganization.updateAccount).toHaveBeenCalledWith('a', 'b', 2, successMessage, errorMessage);
            expect(gettextCatalog.getString).toHaveBeenCalledWith(successMessage);
            expect(gettextCatalog.getString).toHaveBeenCalledWith(errorMessage);
        });
        it('should unset saving flag', (done) => {
            spyOn(preferencesOrganization, 'createAccount').and.callFake(() => q.resolve());
            $ctrl.createAccount().then(() => {
                expect($ctrl.saving).toBeFalsy();
                done();
            });
            scope.$digest();
        });
        it('should refresh', (done) => {
            spyOn(preferencesOrganization, 'updateAccount').and.callFake(() => q.resolve());
            $ctrl.updateAccount().then(() => {
                expect(users.listOrganizationAccounts).toHaveBeenCalledWith(true);
                done();
            });
            scope.$digest();
        });
        it('should revert fields', (done) => {
            spyOn(preferencesOrganization, 'updateAccount').and.callFake(() => q.resolve());
            $ctrl.updateAccount().then(() => {
                expect($ctrl.revert).toHaveBeenCalledWith();
                done();
            });
            scope.$digest();
        });
        it('should handle rejection', (done) => {
            spyOn(preferencesOrganization, 'updateAccount').and.callFake(() => q.reject({ errors: ['a'] }));
            $ctrl.updateAccount().catch(() => {
                expect($ctrl.saving).toBeFalsy();
                done();
            });
            scope.$digest();
        });
    });
    describe('import', () => {
        const account: any = { id: 1 };
        beforeEach(() => {
            account.organization = { name: 'a' };
            spyOn(modal, 'info').and.callFake(() => q.resolve());
        });
        it('should set importing flag', () => {
            spyOn(preferencesOrganization, 'import').and.callFake(() => q.resolve());
            $ctrl.import(account);
            expect($ctrl.importing).toBeTruthy();
        });
        it('should importing', () => {
            spyOn(preferencesOrganization, 'import').and.callFake(() => q.resolve());
            $ctrl.import(account);
            expect(preferencesOrganization.import).toHaveBeenCalledWith(account);
        });
        it('should unset importing flag', (done) => {
            spyOn(preferencesOrganization, 'import').and.callFake(() => q.resolve());
            $ctrl.import(account).then(() => {
                expect($ctrl.importing).toBeFalsy();
                done();
            });
            scope.$digest();
        });
        it('should unset showTntDataSync flag', (done) => {
            spyOn(preferencesOrganization, 'import').and.callFake(() => q.resolve());
            $ctrl.import(account).then(() => {
                expect($ctrl.showTntDataSync).toBeFalsy();
                done();
            });
            scope.$digest();
        });
        it('should alert a translated confirmation', (done) => {
            spyOn(preferencesOrganization, 'import').and.callFake(() => q.resolve());
            $ctrl.import(account).then(() => {
                expect(modal.info).toHaveBeenCalledWith(jasmine.any(String), 'success');
                expect(gettextCatalog.getString).toHaveBeenCalledWith(jasmine.any(String), { name: 'a' }, null);
                done();
            });
            scope.$digest();
        });
        it('should reset file', (done) => {
            spyOn(preferencesOrganization, 'import').and.callFake(() => q.resolve());
            $ctrl.import(account).then(() => {
                expect(account.file).toEqual(null);
                done();
            });
            scope.$digest();
        });
        it('should handle rejection', (done) => {
            spyOn(preferencesOrganization, 'import').and.callFake(() => q.reject({ errors: ['a'] }));
            $ctrl.import(account).catch(() => {
                expect($ctrl.importing).toBeFalsy();
                expect(account.file).toEqual(null);
                expect(alerts.addAlert).toHaveBeenCalledWith(jasmine.any(String), 'danger');
                expect(gettextCatalog.getString).toHaveBeenCalledWith(jasmine.any(String));
                done();
            });
            scope.$digest();
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
