import component from './connect.component';

describe('setup.connect.component', () => {
    let $ctrl, rootScope, scope, componentController,
        api, gettextCatalog, preferencesOrganization, setup, users;

    beforeEach(() => {
        angular.mock.module(component);
        inject((
            $componentController, $rootScope,
            _accounts_, _api_, _gettextCatalog_, _help_, _preferencesOrganization_, _serverConstants_, _setup_,
            _users_
        ) => {
            rootScope = $rootScope;
            componentController = $componentController;
            scope = rootScope.$new();

            api = _api_;
            gettextCatalog = _gettextCatalog_;
            preferencesOrganization = _preferencesOrganization_;
            setup = _setup_;
            users = _users_;

            api.account_list_id = 1234;
            users.current = { preferences: {} };
            users.currentOptions = { setup_position: {} };

            loadController();
        });
        spyOn(gettextCatalog, 'getString').and.callFake((data) => data);
    });

    function loadController() {
        $ctrl = componentController('setupConnect', { $scope: scope }, {});
    }

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

    describe('add', () => {
        beforeEach(() => {
            $ctrl.username = 'a';
            $ctrl.password = 'b';
            $ctrl.selectedKey = 'c';
            spyOn(users, 'listOrganizationAccounts').and.callFake(() => Promise.resolve());
        });

        it('should call createAccount', () => {
            spyOn(preferencesOrganization, 'createAccount').and.callFake(() => Promise.resolve());
            const errorMessage = 'Invalid username or password.';
            $ctrl.add();
            expect(preferencesOrganization.createAccount).toHaveBeenCalledWith('a', 'b', 'c', errorMessage);
            expect(gettextCatalog.getString).toHaveBeenCalledWith(errorMessage);
        });

        it('should refresh if successful', (done) => {
            spyOn(preferencesOrganization, 'createAccount').and.callFake(() => Promise.resolve());
            $ctrl.add().then(() => {
                expect(users.listOrganizationAccounts).toHaveBeenCalledWith(true);
                expect($ctrl.addOrganization).toEqual(false);
                expect($ctrl.username).toEqual('');
                expect($ctrl.password).toEqual('');
                done();
            });
        });
    });

    describe('disconnect', () => {
        beforeEach(() => {
            spyOn(users, 'listOrganizationAccounts').and.callFake(() => Promise.resolve());
        });

        it('should disconnect', (done) => {
            const successMessage = 'MPDX removed your organization integration';
            const errorMessage = 'MPDX couldn\'t save your configuration changes for that organization';
            spyOn(preferencesOrganization, 'disconnect').and.callFake(() => Promise.resolve());
            $ctrl.disconnect(1).then(() => {
                expect(preferencesOrganization.disconnect).toHaveBeenCalledWith(1, successMessage, errorMessage);
                expect(gettextCatalog.getString).toHaveBeenCalledWith(successMessage);
                expect(gettextCatalog.getString).toHaveBeenCalledWith(errorMessage);
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

    describe('next', () => {
        beforeEach(() => {
            spyOn(setup, 'next').and.callFake(() => Promise.resolve());
        });

        it('should call setup.next', () => {
            $ctrl.next();
            expect(setup.next).toHaveBeenCalled();
        });

        it('should set saving to true', () => {
            $ctrl.saving = false;
            $ctrl.next();
            expect($ctrl.saving).toEqual(true);
        });

        it('should return a promise', () => {
            expect($ctrl.next()).toEqual(jasmine.any(Promise));
        });

        describe('promise successful', () => {
            it('should set saving to false', (done) => {
                $ctrl.saving = true;
                $ctrl.next().then(() => {
                    expect($ctrl.saving).toEqual(false);
                    done();
                });
            });
        });
    });
});
