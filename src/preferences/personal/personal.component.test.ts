import component from './personal.component';

describe('preferences.personal.component', () => {
    let $ctrl, accounts, rootScope, scope, componentController, gettextCatalog, serverConstants, users, q;
    beforeEach(() => {
        angular.mock.module(component);
        inject((
            $componentController, $rootScope, _accounts_, _gettextCatalog_, _users_, _serverConstants_, $q
        ) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            accounts = _accounts_;
            users = _users_;
            gettextCatalog = _gettextCatalog_;
            serverConstants = _serverConstants_;
            q = $q;
            componentController = $componentController;
            serverConstants.data = { pledge_currenices: {} };
            loadController();
        });
        spyOn(gettextCatalog, 'getString').and.callThrough();
    });

    function loadController() {
        $ctrl = componentController('preferencesPersonal', { $scope: scope }, { onSave: () => q.resolve() });
    }
    describe('save', () => {
        beforeEach(() => {
            spyOn($ctrl, 'setTab').and.callFake(() => {});
            spyOn($ctrl, 'onSave').and.callFake(() => {});
        });
        it('should set saving flag', () => {
            spyOn(users, 'saveCurrent').and.callFake(() => q.resolve());
            $ctrl.save();
            expect($ctrl.saving).toBeTruthy();
        });
        it('should save', () => {
            spyOn(users, 'saveCurrent').and.callFake(() => q.resolve());
            const successMessage = 'Preferences saved successfully';
            $ctrl.save();
            expect(users.saveCurrent).toHaveBeenCalledWith(successMessage);
            expect(gettextCatalog.getString).toHaveBeenCalledWith(successMessage);
        });
        it('should unset saving flag', (done) => {
            spyOn(users, 'saveCurrent').and.callFake(() => q.resolve());
            $ctrl.save().then(() => {
                expect($ctrl.saving).toBeFalsy();
                done();
            });
            scope.$digest();
        });
        it('should unset tab', (done) => {
            spyOn(users, 'saveCurrent').and.callFake(() => q.resolve());
            $ctrl.save().then(() => {
                expect($ctrl.setTab).toHaveBeenCalledWith('');
                done();
            });
            scope.$digest();
        });
        it('should call onSave', (done) => {
            spyOn(users, 'saveCurrent').and.callFake(() => q.resolve());
            $ctrl.save().then(() => {
                expect($ctrl.onSave).toHaveBeenCalledWith();
                done();
            });
            scope.$digest();
        });
        it('should handle rejection', (done) => {
            spyOn(users, 'saveCurrent').and.callFake(() => q.reject({ errors: ['a'] }));
            $ctrl.save().catch(() => {
                expect($ctrl.saving).toBeFalsy();
                done();
            });
            scope.$digest();
        });
    });
    describe('saveAccount', () => {
        beforeEach(() => {
            spyOn($ctrl, 'setTab').and.callFake(() => {});
            spyOn($ctrl, 'onSave').and.callFake(() => {});
        });
        it('should set saving flag', () => {
            spyOn(accounts, 'saveCurrent').and.callFake(() => q.resolve());
            $ctrl.saveAccount();
            expect($ctrl.saving).toBeTruthy();
        });
        it('should save', () => {
            const successMessage = 'Preferences saved successfully';
            spyOn(accounts, 'saveCurrent').and.callFake(() => q.resolve());
            $ctrl.saveAccount();
            expect(accounts.saveCurrent).toHaveBeenCalledWith(successMessage);
            expect(gettextCatalog.getString).toHaveBeenCalledWith(successMessage);
        });
        it('should unset saving flag', (done) => {
            spyOn(accounts, 'saveCurrent').and.callFake(() => q.resolve());
            $ctrl.saveAccount().then(() => {
                expect($ctrl.saving).toBeFalsy();
                done();
            });
            scope.$digest();
        });
        it('should unset tab', (done) => {
            spyOn(accounts, 'saveCurrent').and.callFake(() => q.resolve());
            $ctrl.saveAccount().then(() => {
                expect($ctrl.setTab).toHaveBeenCalledWith('');
                done();
            });
            scope.$digest();
        });
        it('should call onSave', (done) => {
            spyOn(accounts, 'saveCurrent').and.callFake(() => q.resolve());
            $ctrl.saveAccount().then(() => {
                expect($ctrl.onSave).toHaveBeenCalledWith();
                done();
            });
            scope.$digest();
        });
        it('should handle rejection', (done) => {
            spyOn(accounts, 'saveCurrent').and.callFake(() => q.reject({ errors: ['a'] }));
            $ctrl.saveAccount().catch(() => {
                expect($ctrl.saving).toBeFalsy();
                done();
            });
            scope.$digest();
        });
    });
});