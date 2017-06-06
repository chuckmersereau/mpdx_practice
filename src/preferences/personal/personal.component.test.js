import component from './personal.component';

describe('preferences.personal.component', () => {
    let $ctrl, accounts, rootScope, scope, componentController, alerts, gettextCatalog, serverConstants, users;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _accounts_, _gettextCatalog_, _alerts_, _users_, _serverConstants_) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            accounts = _accounts_;
            alerts = _alerts_;
            users = _users_;
            gettextCatalog = _gettextCatalog_;
            serverConstants = _serverConstants_;
            componentController = $componentController;
            serverConstants.data = {pledge_currenices: {}};
            loadController();
        });
        spyOn(alerts, 'addAlert').and.callFake(data => data);
        spyOn(gettextCatalog, 'getString').and.callThrough();
    });
    function loadController() {
        $ctrl = componentController('preferencesPersonal', {$scope: scope}, {onSave: () => Promise.resolve()});
    }
    describe('save', () => {
        beforeEach(() => {
            spyOn($ctrl, 'setTab').and.callFake(() => {});
            spyOn($ctrl, 'onSave').and.callFake(() => {});
        });
        it('should set saving flag', () => {
            spyOn(users, 'saveCurrent').and.callFake(() => Promise.resolve());
            $ctrl.save();
            expect($ctrl.saving).toBeTruthy();
        });
        it('should save', () => {
            spyOn(users, 'saveCurrent').and.callFake(() => Promise.resolve());
            $ctrl.save();
            expect(users.saveCurrent).toHaveBeenCalledWith();
        });
        it('should unset saving flag', done => {
            spyOn(users, 'saveCurrent').and.callFake(() => Promise.resolve());
            $ctrl.save().then(() => {
                expect($ctrl.saving).toBeFalsy();
                done();
            });
        });
        it('should unset tab', done => {
            spyOn(users, 'saveCurrent').and.callFake(() => Promise.resolve());
            $ctrl.save().then(() => {
                expect($ctrl.setTab).toHaveBeenCalledWith('');
                done();
            });
        });
        it('should call onSave', done => {
            spyOn(users, 'saveCurrent').and.callFake(() => Promise.resolve());
            $ctrl.save().then(() => {
                expect($ctrl.onSave).toHaveBeenCalledWith();
                done();
            });
        });
        it('should alert a translated confirmation', done => {
            spyOn(users, 'saveCurrent').and.callFake(() => Promise.resolve());
            $ctrl.save().then(() => {
                expect(alerts.addAlert).toHaveBeenCalledWith(jasmine.any(String), 'success');
                expect(gettextCatalog.getString).toHaveBeenCalledWith(jasmine.any(String));
                done();
            });
        });
        it('should handle rejection', done => {
            spyOn(users, 'saveCurrent').and.callFake(() => Promise.reject({errors: ['a']}));
            $ctrl.save().catch(() => {
                expect($ctrl.saving).toBeFalsy();
                expect(alerts.addAlert).toHaveBeenCalledWith(jasmine.any(String), 'danger');
                done();
            });
        });
    });
    describe('saveAccount', () => {
        beforeEach(() => {
            spyOn($ctrl, 'setTab').and.callFake(() => {});
            spyOn($ctrl, 'onSave').and.callFake(() => {});
        });
        it('should set saving flag', () => {
            spyOn(accounts, 'saveCurrent').and.callFake(() => Promise.resolve());
            $ctrl.saveAccount();
            expect($ctrl.saving).toBeTruthy();
        });
        it('should save', () => {
            spyOn(accounts, 'saveCurrent').and.callFake(() => Promise.resolve());
            $ctrl.saveAccount();
            expect(accounts.saveCurrent).toHaveBeenCalledWith();
        });
        it('should unset saving flag', done => {
            spyOn(accounts, 'saveCurrent').and.callFake(() => Promise.resolve());
            $ctrl.saveAccount().then(() => {
                expect($ctrl.saving).toBeFalsy();
                done();
            });
        });
        it('should unset tab', done => {
            spyOn(accounts, 'saveCurrent').and.callFake(() => Promise.resolve());
            $ctrl.saveAccount().then(() => {
                expect($ctrl.setTab).toHaveBeenCalledWith('');
                done();
            });
        });
        it('should call onSave', done => {
            spyOn(accounts, 'saveCurrent').and.callFake(() => Promise.resolve());
            $ctrl.saveAccount().then(() => {
                expect($ctrl.onSave).toHaveBeenCalledWith();
                done();
            });
        });
        it('should alert a translated confirmation', done => {
            spyOn(accounts, 'saveCurrent').and.callFake(() => Promise.resolve());
            $ctrl.saveAccount().then(() => {
                expect(alerts.addAlert).toHaveBeenCalledWith(jasmine.any(String), 'success');
                expect(gettextCatalog.getString).toHaveBeenCalledWith(jasmine.any(String));
                done();
            });
        });
        it('should handle rejection', done => {
            spyOn(accounts, 'saveCurrent').and.callFake(() => Promise.reject({errors: ['a']}));
            $ctrl.saveAccount().catch(() => {
                expect($ctrl.saving).toBeFalsy();
                expect(alerts.addAlert).toHaveBeenCalledWith(jasmine.any(String), 'danger');
                done();
            });
        });
    });
});