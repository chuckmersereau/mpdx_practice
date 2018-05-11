import component from './mailchimp.component';

describe('preferences.integrations.mailchimp.component', () => {
    let $ctrl, mailchimp, rootScope, scope, gettextCatalog, modal, api, q;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _mailchimp_, _gettextCatalog_, _modal_, _api_, $q) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            api = _api_;
            mailchimp = _mailchimp_;
            modal = _modal_;
            gettextCatalog = _gettextCatalog_;
            q = $q;
            api.account_list_id = 123;
            $ctrl = $componentController('mailchimpIntegrationPreferences', { $scope: scope }, {});
        });
        spyOn(gettextCatalog, 'getString').and.callThrough();
    });

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
            spyOn(mailchimp, 'load').and.callFake(() => q.resolve());
            spyOn(modal, 'info').and.callFake(() => q.resolve());
        });

        it('should set saving flag', () => {
            $ctrl.save();
            expect($ctrl.saving).toBeTruthy();
        });

        it('should create an invite', () => {
            spyOn(api, 'post').and.callFake(() => q.resolve());
            const successMessage = 'Preferences saved successfully';
            $ctrl.save();
            expect(gettextCatalog.getString).toHaveBeenCalledWith(jasmine.any(String));
            expect(api.post).toHaveBeenCalledWith({
                url: 'account_lists/123/mail_chimp_account',
                data: mailchimp.data,
                successMessage: successMessage
            });
        });

        it('should unset saving flag', (done) => {
            spyOn(api, 'post').and.callFake(() => q.resolve());
            $ctrl.save().then(() => {
                expect($ctrl.saving).toBeFalsy();
                done();
            });
            scope.$digest();
        });

        it('should set showSettings false', (done) => {
            spyOn(api, 'post').and.callFake(() => q.resolve());
            $ctrl.save().then(() => {
                expect($ctrl.showSettings).toBeFalsy();
                done();
            });
            scope.$digest();
        });

        it('should refresh', (done) => {
            spyOn(api, 'post').and.callFake(() => q.resolve());
            $ctrl.save().then(() => {
                expect(mailchimp.load).toHaveBeenCalledWith();
                done();
            });
            rootScope.$digest();
        });

        it('should alert a translated confirmation', (done) => {
            spyOn(api, 'post').and.callFake(() => q.resolve());
            $ctrl.save().then(() => {
                expect(modal.info).toHaveBeenCalledWith('Your MailChimp sync has been started. This process may take up to 4 hours to complete.');
                expect(gettextCatalog.getString).toHaveBeenCalledWith('Your MailChimp sync has been started. This process may take up to 4 hours to complete.');
                done();
            });
            scope.$digest();
        });

        it('should handle rejection', (done) => {
            spyOn(api, 'post').and.callFake(() => q.reject({ errors: ['a'] }));
            $ctrl.save().catch(() => {
                expect($ctrl.saving).toBeFalsy();
                done();
            });
            scope.$digest();
        });
    });

    describe('disconnect', () => {
        beforeEach(() => {
            spyOn(modal, 'confirm').and.callFake(() => q.resolve());
        });

        it('should confirm with translated message', () => {
            $ctrl.disconnect();
            expect(modal.confirm).toHaveBeenCalledWith(jasmine.any(String));
            expect(gettextCatalog.getString).toHaveBeenCalledWith(jasmine.any(String));
        });

        it('should disconnect', (done) => {
            spyOn(api, 'delete').and.callFake(() => q.resolve());
            const errorMessage = 'MPDX couldn\'t save your configuration changes for MailChimp';
            const successMessage = 'MPDX removed your integration with MailChimp';
            $ctrl.disconnect().then(() => {
                expect(gettextCatalog.getString).toHaveBeenCalledWith(jasmine.any(String));
                expect(api.delete).toHaveBeenCalledWith(
                    'account_lists/123/mail_chimp_account',
                    undefined, successMessage, errorMessage
                );
                done();
            });
            scope.$digest();
        });

        it('should unset saving flag', (done) => {
            spyOn(api, 'delete').and.callFake(() => q.resolve());
            $ctrl.disconnect().then(() => {
                expect($ctrl.saving).toBeFalsy();
                done();
            });
            scope.$digest();
        });

        it('should set showSettings false', (done) => {
            spyOn(api, 'delete').and.callFake(() => q.resolve());
            $ctrl.disconnect().then(() => {
                expect($ctrl.showSettings).toBeFalsy();
                done();
            });
            scope.$digest();
        });

        it('should handle rejection', (done) => {
            spyOn(api, 'delete').and.callFake(() => q.reject({ errors: ['a'] }));
            $ctrl.disconnect().catch(() => {
                expect($ctrl.saving).toBeFalsy();
                done();
            });
            scope.$digest();
        });
    });

    describe('sync', () => {
        beforeEach(() => {
            spyOn(mailchimp, 'load').and.callFake(() => q.resolve());
            spyOn(modal, 'info').and.callFake(() => q.resolve());
        });

        it('should set saving flag', () => {
            $ctrl.sync();
            expect($ctrl.saving).toBeTruthy();
        });

        it('should create an invite', () => {
            spyOn(api, 'get').and.callFake(() => q.resolve());
            const errorMessage = 'MPDX couldn\'t save your configuration changes for MailChimp';
            $ctrl.sync();
            expect(gettextCatalog.getString).toHaveBeenCalledWith(errorMessage);
            expect(api.get).toHaveBeenCalledWith(
                'account_lists/123/mail_chimp_account/sync',
                undefined, undefined, errorMessage
            );
        });

        it('should unset saving flag', (done) => {
            spyOn(api, 'get').and.callFake(() => q.resolve());
            $ctrl.sync().then(() => {
                expect($ctrl.saving).toBeFalsy();
                done();
            });
            rootScope.$digest();
        });

        it('should alert a translated confirmation', (done) => {
            spyOn(api, 'get').and.callFake(() => q.resolve());
            $ctrl.sync().then(() => {
                expect(modal.info).toHaveBeenCalledWith('Your MailChimp sync has been started. This process may take up to 4 hours to complete.');
                expect(gettextCatalog.getString).toHaveBeenCalledWith('Your MailChimp sync has been started. This process may take up to 4 hours to complete.');
                done();
            });
            scope.$digest();
        });

        it('should handle rejection', (done) => {
            spyOn(api, 'get').and.callFake(() => q.reject({ errors: ['a'] }));
            $ctrl.sync().catch(() => {
                expect($ctrl.saving).toBeFalsy();
                done();
            });
            scope.$digest();
        });
    });
});