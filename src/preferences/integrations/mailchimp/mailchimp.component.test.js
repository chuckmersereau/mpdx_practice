import component from './mailchimp.component';

describe('preferences.integrations.mailchimp.component', () => {
    let $ctrl, mailchimp, help, rootScope, scope, componentController, alerts, gettextCatalog, modal;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _mailchimp_, _help_, _alerts_, _gettextCatalog_, _modal_) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            mailchimp = _mailchimp_;
            alerts = _alerts_;
            modal = _modal_;
            help = _help_;
            gettextCatalog = _gettextCatalog_;
            componentController = $componentController;
            loadController();
        });
        spyOn(alerts, 'addAlert').and.callFake(data => data);
        spyOn(gettextCatalog, 'getString').and.callThrough();
    });
    function loadController() {
        $ctrl = componentController('mailchimpIntegrationPreferences', {$scope: scope}, {});
    }
    describe('constructor', () => {
        it('should set default values', () => {
            expect($ctrl.saving).toBeFalsy();
            expect($ctrl.showSettings).toBeFalsy();
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
            spyOn(mailchimp, 'save').and.callFake(() => Promise.resolve());
            $ctrl.save();
            expect(mailchimp.save).toHaveBeenCalledWith();
        });
        it('should unset saving flag', done => {
            spyOn(mailchimp, 'save').and.callFake(() => Promise.resolve());
            $ctrl.save().then(() => {
                expect($ctrl.saving).toBeFalsy();
                done();
            });
        });
        it('should alert a translated confirmation', done => {
            spyOn(mailchimp, 'save').and.callFake(() => Promise.resolve());
            $ctrl.save().then(() => {
                expect(alerts.addAlert).toHaveBeenCalledWith(jasmine.any(String), 'success');
                expect(gettextCatalog.getString).toHaveBeenCalledWith(jasmine.any(String));
                done();
            });
        });
        it('should set showSettings false', done => {
            spyOn(mailchimp, 'save').and.callFake(() => Promise.resolve());
            $ctrl.save().then(() => {
                expect($ctrl.showSettings).toBeFalsy();
                done();
            });
        });
        it('should refresh', done => {
            spyOn(mailchimp, 'save').and.callFake(() => Promise.resolve());
            $ctrl.save().then(() => {
                expect(mailchimp.load).toHaveBeenCalledWith(true);
                done();
            });
        });
        it('should handle rejection', done => {
            spyOn(mailchimp, 'save').and.callFake(() => Promise.reject({errors: ['a']}));
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
            spyOn(mailchimp, 'disconnect').and.callFake(() => Promise.resolve());
            $ctrl.disconnect().then(() => {
                expect(mailchimp.disconnect).toHaveBeenCalledWith();
                done();
            });
        });
        it('should unset saving flag', done => {
            spyOn(mailchimp, 'disconnect').and.callFake(() => Promise.resolve());
            $ctrl.disconnect().then(() => {
                expect($ctrl.saving).toBeFalsy();
                done();
            });
        });
        it('should alert a translated confirmation', done => {
            spyOn(mailchimp, 'disconnect').and.callFake(() => Promise.resolve());
            $ctrl.disconnect().then(() => {
                expect(alerts.addAlert).toHaveBeenCalledWith(jasmine.any(String), 'success');
                expect(gettextCatalog.getString).toHaveBeenCalledWith(jasmine.any(String));
                done();
            });
        });
        it('should set showSettings false', done => {
            spyOn(mailchimp, 'disconnect').and.callFake(() => Promise.resolve());
            $ctrl.disconnect().then(() => {
                expect($ctrl.showSettings).toBeFalsy();
                done();
            });
        });
        it('should handle rejection', done => {
            spyOn(mailchimp, 'disconnect').and.callFake(() => Promise.reject({errors: ['a']}));
            $ctrl.disconnect().catch(() => {
                expect($ctrl.saving).toBeFalsy();
                expect(alerts.addAlert).toHaveBeenCalledWith(jasmine.any(String), 'danger');
                expect(gettextCatalog.getString).toHaveBeenCalledWith(jasmine.any(String));
                done();
            });
        });
    });
    describe('sync', () => {
        beforeEach(() => {
            spyOn(mailchimp, 'load').and.callFake(() => Promise.resolve());
        });
        it('should set saving flag', () => {
            $ctrl.sync();
            expect($ctrl.saving).toBeTruthy();
        });
        it('should create an invite', () => {
            spyOn(mailchimp, 'sync').and.callFake(() => Promise.resolve());
            $ctrl.sync();
            expect(mailchimp.sync).toHaveBeenCalledWith();
        });
        it('should unset saving flag', done => {
            spyOn(mailchimp, 'sync').and.callFake(() => Promise.resolve());
            $ctrl.sync().then(() => {
                expect($ctrl.saving).toBeFalsy();
                done();
            });
        });
        it('should alert a translated confirmation', done => {
            spyOn(mailchimp, 'sync').and.callFake(() => Promise.resolve());
            $ctrl.sync().then(() => {
                expect(alerts.addAlert).toHaveBeenCalledWith(jasmine.any(String), 'success');
                expect(gettextCatalog.getString).toHaveBeenCalledWith(jasmine.any(String));
                done();
            });
        });
        it('should handle rejection', done => {
            spyOn(mailchimp, 'sync').and.callFake(() => Promise.reject({errors: ['a']}));
            $ctrl.sync().catch(() => {
                expect($ctrl.saving).toBeFalsy();
                expect(alerts.addAlert).toHaveBeenCalledWith(jasmine.any(String), 'danger');
                expect(gettextCatalog.getString).toHaveBeenCalledWith(jasmine.any(String));
                done();
            });
        });
    });
});