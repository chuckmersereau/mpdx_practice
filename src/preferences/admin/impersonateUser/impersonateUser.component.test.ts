import component from './impersonateUser.component';

describe('preferences.admin.impersonateUser.component', () => {
    let $ctrl, componentController, scope, rootScope, $$window, gettextCatalog, api, users, alerts, q;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, $window, _gettextCatalog_, _api_, _users_, _alerts_, $q) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            componentController = $componentController;
            $$window = $window;
            gettextCatalog = _gettextCatalog_;
            alerts = _alerts_;
            api = _api_;
            users = _users_;
            q = $q;
            $ctrl = componentController('preferencesAdminImpersonateUser', { $scope: scope }, {});
        });
        spyOn(gettextCatalog, 'getString').and.callThrough();
        spyOn(alerts, 'addAlert').and.callFake(() => {});
    });

    describe('constructor', () => {
        it('should set default values', () => {
            expect($ctrl.impersonateUser).toEqual({ user: '', reason: '' });
            expect($ctrl.saving).toEqual(false);
        });
    });

    describe('save', () => {
        let spy;

        beforeEach(() => {
            spy = spyOn(api, 'post').and.callFake(() => q.resolve({ json_web_token: 'user_token' }));
        });

        it('should set saving to true', () => {
            $ctrl.save();
            expect($ctrl.saving).toEqual(true);
        });

        it('should call the api', () => {
            $ctrl.save();
            expect(api.post).toHaveBeenCalledWith({
                url: 'admin/impersonation',
                data: { user: '', reason: '' },
                type: 'impersonation',
                overridePromise: true
            });
        });

        it('should return a promise', () => {
            expect($ctrl.save()).toEqual(jasmine.any(q));
        });

        describe('promise successful', () => {
            beforeEach(() => {
                spyOn($ctrl, 'redirectHome').and.returnValue('');
                spyOn($$window.localStorage, 'setItem').and.callFake(() => {});
                users.current = {
                    first_name: 'Bob',
                    last_name: 'Smith'
                };
            });

            it('should set impersonatorToken to token', (done) => {
                spyOn($$window.localStorage, 'getItem').and.returnValue('impersonator_token');

                $ctrl.save().then(() => {
                    expect($$window.localStorage.setItem).toHaveBeenCalledWith('impersonatorToken', 'impersonator_token');
                    done();
                });
                scope.$digest();
            });

            it('should set impersonator', (done) => {
                $ctrl.save().then(() => {
                    expect($$window.localStorage.setItem).toHaveBeenCalledWith('impersonator', 'Bob Smith');
                    done();
                });
                scope.$digest();
            });

            it('should set token', (done) => {
                $ctrl.save().then(() => {
                    expect($$window.localStorage.setItem).toHaveBeenCalledWith('token', 'user_token');
                    done();
                });
                scope.$digest();
            });

            it('should call redirectHome', (done) => {
                $ctrl.save().then(() => {
                    expect($ctrl.redirectHome).toHaveBeenCalled();
                    done();
                });
                scope.$digest();
            });
        });

        describe('promise unsuccessful', () => {
            beforeEach(() => {
                spy.and.callFake(() => q.reject());
            });

            it('should translate an error message', (done) => {
                $ctrl.save().catch(() => {
                    const errorMessage = 'Unable to impersonate provided user';
                    expect(gettextCatalog.getString).toHaveBeenCalledWith(errorMessage);
                    expect(alerts.addAlert).toHaveBeenCalledWith(errorMessage, 'danger', 3);
                    done();
                });
                scope.$digest();
            });

            it('should set saving to false', (done) => {
                $ctrl.save().catch(() => {
                    expect($ctrl.saving).toEqual(false);
                    done();
                });
                scope.$digest();
            });
        });

        describe('user not found', () => {
            beforeEach(() => {
                spy.and.callFake(() => q.reject({ status: 404 }));
            });

            it('should translate an error message for 404', (done) => {
                $ctrl.save().catch(() => {
                    const errorMessage = 'Unable to find a user with provided credentials.';
                    expect(gettextCatalog.getString).toHaveBeenCalledWith(errorMessage);
                    expect(alerts.addAlert).toHaveBeenCalledWith(errorMessage, 'warning', 3);
                    done();
                });
                scope.$digest();
            });
        });
    });
});
