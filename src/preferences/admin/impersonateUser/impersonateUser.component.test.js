import component from './impersonateUser.component';

describe('preferences.admin.impersonateUser.component', () => {
    let $ctrl, componentController, scope, rootScope, $$window, alerts, api, users;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, $window, _alerts_, _api_, _users_) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            componentController = $componentController;
            $$window = $window;
            alerts = _alerts_;
            api = _api_;
            users = _users_;
            loadController();
        });
    });

    function loadController() {
        $ctrl = componentController('preferencesAdminImpersonateUser', { $scope: scope }, {});
    }

    describe('constructor', () => {
        it('should set default values', () => {
            expect($ctrl.impersonateUser).toEqual({ user: '', reason: '' });
            expect($ctrl.saving).toEqual(false);
        });
    });

    describe('save', () => {
        let spy;

        beforeEach(() => {
            spy = spyOn(api, 'post').and.callFake(() => Promise.resolve({ json_web_token: 'user_token' }));
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
                type: 'impersonation'
            });
        });

        it('should return a promise', () => {
            expect($ctrl.save()).toEqual(jasmine.any(Promise));
        });

        describe('promise successful', () => {
            beforeEach(() => {
                spyOn($ctrl, 'redirectHome').and.returnValue();
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
            });

            it('should set impersonator', (done) => {
                $ctrl.save().then(() => {
                    expect($$window.localStorage.setItem).toHaveBeenCalledWith('impersonator', 'Bob Smith');
                    done();
                });
            });

            it('should set token', (done) => {
                $ctrl.save().then(() => {
                    expect($$window.localStorage.setItem).toHaveBeenCalledWith('token', 'user_token');
                    done();
                });
            });

            it('should call redirectHome', (done) => {
                $ctrl.save().then(() => {
                    expect($ctrl.redirectHome).toHaveBeenCalled();
                    done();
                });
            });
        });

        describe('promise unsuccessful', () => {
            beforeEach(() => {
                spy.and.callFake(() => Promise.reject());
            });

            it('should set saving to false', (done) => {
                $ctrl.save().then(() => {
                    expect($ctrl.saving).toEqual(false);
                    done();
                });
            });

            it('should call alerts.addAlert', (done) => {
                spyOn(alerts, 'addAlert').and.callThrough();
                $ctrl.save().then(() => {
                    expect(alerts.addAlert).toHaveBeenCalledWith('Unable to impersonate provided user', 'danger');
                    done();
                });
            });
        });
    });
});
