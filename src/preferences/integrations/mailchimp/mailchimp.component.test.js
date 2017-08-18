import component from './mailchimp.component';

describe('preferences.integrations.mailchimp.component', () => {
    let $ctrl, mailchimp, rootScope, scope, componentController, alerts, gettextCatalog, modal, api;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _mailchimp_, _alerts_, _gettextCatalog_, _modal_, _api_) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            api = _api_;
            mailchimp = _mailchimp_;
            alerts = _alerts_;
            modal = _modal_;
            gettextCatalog = _gettextCatalog_;
            componentController = $componentController;
            api.account_list_id = 123;
            loadController();
        });
        spyOn(alerts, 'addAlert').and.callFake(data => data);
        spyOn(gettextCatalog, 'getString').and.callThrough();
    });
    function loadController() {
        $ctrl = componentController('mailchimpIntegrationPreferences', { $scope: scope }, {});
    }
    describe('constructor', () => {
        it('should set default values', () => {
            expect($ctrl.saving).toBeFalsy();
            expect($ctrl.showSettings).toBeFalsy();
        });
    });
    describe('$onInit', () => {
        beforeEach(() => {
            spyOn(mailchimp, 'load').and.callFake(() => {});
        });
        it('should build the oAuth url', () => {
            $ctrl.$onInit();
            expect($ctrl.oAuth).toBeDefined();
        });
        it('should call load', () => {
            $ctrl.$onInit();
            expect(mailchimp.load).toHaveBeenCalledWith();
        });
    });
    describe('save', () => {
        beforeEach(() => {
            spyOn(mailchimp, 'load').and.callFake(() => Promise.resolve());
        });
        it('should set saving flag', () => {
            $ctrl.save();
            expect($ctrl.saving).toBeTruthy();
        });
        it('should create an invite', () => {
            spyOn(api, 'post').and.callFake(() => Promise.resolve());
            $ctrl.save();
            expect(api.post).toHaveBeenCalledWith({ url: 'account_lists/123/mail_chimp_account', data: mailchimp.data });
        });
        it('should unset saving flag', done => {
            spyOn(api, 'post').and.callFake(() => Promise.resolve());
            $ctrl.save().then(() => {
                expect($ctrl.saving).toBeFalsy();
                done();
            });
        });
        it('should alert a translated confirmation', done => {
            spyOn(api, 'post').and.callFake(() => Promise.resolve());
            $ctrl.save().then(() => {
                expect(alerts.addAlert).toHaveBeenCalledWith(jasmine.any(String), 'success');
                expect(gettextCatalog.getString).toHaveBeenCalledWith(jasmine.any(String));
                done();
            });
        });
        it('should set showSettings false', done => {
            spyOn(api, 'post').and.callFake(() => Promise.resolve());
            $ctrl.save().then(() => {
                expect($ctrl.showSettings).toBeFalsy();
                done();
            });
        });
        it('should refresh', done => {
            spyOn(api, 'post').and.callFake(() => Promise.resolve());
            $ctrl.save().then(() => {
                expect(mailchimp.load).toHaveBeenCalledWith();
                done();
            });
        });
        it('should handle rejection', done => {
            spyOn(api, 'post').and.callFake(() => Promise.reject({ errors: ['a'] }));
            $ctrl.save().catch(() => {
                expect($ctrl.saving).toBeFalsy();
                expect(alerts.addAlert).toHaveBeenCalledWith(jasmine.any(String), 'danger');
                done();
            });
        });
    });
    describe('disconnect', () => {
        beforeEach(() => {
            spyOn(modal, 'confirm').and.callFake(() => Promise.resolve());
        });
        it('should confirm with translated message', () => {
            $ctrl.disconnect();
            expect(modal.confirm).toHaveBeenCalledWith(jasmine.any(String));
            expect(gettextCatalog.getString).toHaveBeenCalledWith(jasmine.any(String));
        });
        it('should disconnect', done => {
            spyOn(api, 'delete').and.callFake(() => Promise.resolve());
            $ctrl.disconnect().then(() => {
                expect(api.delete).toHaveBeenCalledWith('account_lists/123/mail_chimp_account');
                done();
            });
        });
        it('should unset saving flag', done => {
            spyOn(api, 'delete').and.callFake(() => Promise.resolve());
            $ctrl.disconnect().then(() => {
                expect($ctrl.saving).toBeFalsy();
                done();
            });
        });
        it('should alert a translated confirmation', done => {
            spyOn(api, 'delete').and.callFake(() => Promise.resolve());
            $ctrl.disconnect().then(() => {
                expect(alerts.addAlert).toHaveBeenCalledWith(jasmine.any(String), 'success');
                expect(gettextCatalog.getString).toHaveBeenCalledWith(jasmine.any(String));
                done();
            });
        });
        it('should set showSettings false', done => {
            spyOn(api, 'delete').and.callFake(() => Promise.resolve());
            $ctrl.disconnect().then(() => {
                expect($ctrl.showSettings).toBeFalsy();
                done();
            });
        });
        it('should handle rejection', done => {
            spyOn(api, 'delete').and.callFake(() => Promise.reject({ errors: ['a'] }));
            $ctrl.disconnect().catch(() => {
                expect($ctrl.saving).toBeFalsy();
                expect(alerts.addAlert).toHaveBeenCalledWith(jasmine.any(String), 'danger');
                expect(gettextCatalog.getString).toHaveBeenCalledWith(jasmine.any(String));
                done();
            });
        });
    });
    describe('sync', () => {
        it('should set saving flag', () => {
            $ctrl.sync();
            expect($ctrl.saving).toBeTruthy();
        });
        it('should create an invite', () => {
            spyOn(api, 'get').and.callFake(() => Promise.resolve());
            $ctrl.sync();
            expect(api.get).toHaveBeenCalledWith('account_lists/123/mail_chimp_account/sync');
        });
        it('should unset saving flag', done => {
            spyOn(api, 'get').and.callFake(() => Promise.resolve());
            $ctrl.sync().then(() => {
                expect($ctrl.saving).toBeFalsy();
                done();
            });
        });
        it('should alert a translated confirmation', done => {
            spyOn(api, 'get').and.callFake(() => Promise.resolve());
            $ctrl.sync().then(() => {
                expect(alerts.addAlert).toHaveBeenCalledWith(jasmine.any(String), 'success');
                expect(gettextCatalog.getString).toHaveBeenCalledWith(jasmine.any(String));
                done();
            });
        });
        it('should handle rejection', done => {
            spyOn(api, 'get').and.callFake(() => Promise.reject({ errors: ['a'] }));
            $ctrl.sync().catch(() => {
                expect($ctrl.saving).toBeFalsy();
                expect(alerts.addAlert).toHaveBeenCalledWith(jasmine.any(String), 'danger');
                expect(gettextCatalog.getString).toHaveBeenCalledWith(jasmine.any(String));
                done();
            });
        });
    });
});