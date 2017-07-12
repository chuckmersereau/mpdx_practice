import component from './auth.component';

describe('auth.component', () => {
    let $ctrl, componentController, scope, rootScope, http, location, $$window, state;

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, $http, $location, $window, $state) => {
            componentController = $componentController;
            rootScope = $rootScope;
            scope = rootScope.$new();
            http = $http;
            location = $location;
            $$window = $window;
            state = $state;
            loadController();
            spyOn(state, 'go').and.callThrough();
        });
    });

    function loadController() {
        $ctrl = componentController('auth', { $scope: scope });
    }

    describe('$onInit', () => {
        let spy;

        beforeEach(() => {
            spy = spyOn(http, 'get').and.callFake(() => Promise.resolve({ data: { ticket: 'ticket' } }));
        });

        describe('access_token set', () => {
            beforeEach(() => {
                $ctrl.$stateParams = {
                    access_token: 'access_token'
                };
            });

            it('should return promise', () => {
                expect($ctrl.$onInit()).toEqual(jasmine.any(Promise));
            });

            it('should call $http.get', () => {
                $ctrl.$onInit();
                expect(http.get).toHaveBeenCalledWith(
                    'https://thekey.me/cas/api/oauth/ticket',
                    {
                        headers: {
                            Authorization: 'Bearer access_token',
                            Accept: 'application/json'
                        },
                        params: {
                            service: '/api/v1/user/authenticate'
                        },
                        skipAuthorization: true
                    }
                );
            });

            describe('promise successful', () => {
                it('should call convertTicketToJWT', (done) => {
                    spyOn($ctrl, 'convertTicketToJWT').and.returnValue();
                    $ctrl.$onInit().then(() => {
                        expect($ctrl.convertTicketToJWT).toHaveBeenCalledWith('ticket');
                        done();
                    });
                });
            });

            describe('promise rejected', () => {
                beforeEach(() => {
                    spy.and.callFake(() => Promise.reject(Error('something went wrong')));
                });

                it('should call state.go', (done) => {
                    $ctrl.$onInit().catch(() => {
                        expect(state.go).toHaveBeenCalledWith('logout');
                        done();
                    });
                });
            });
        });
    });

    describe('convertTicketToJWT', () => {
        let spy;

        beforeEach(() => {
            spy = spyOn(http, 'post').and.callFake(() => Promise.resolve(
                { data: { data: { attributes: { json_web_token: 'json_web_token' } } } }));
        });

        it('should return promise', () => {
            expect($ctrl.convertTicketToJWT('ticket')).toEqual(jasmine.any(Promise));
        });

        it('should call $http.post', () => {
            $ctrl.convertTicketToJWT('ticket');
            expect(http.post).toHaveBeenCalledWith(
                '/api/v1/user/authenticate',
                {
                    data: {
                        type: "authenticate",
                        attributes: {
                            cas_ticket: 'ticket'
                        }
                    }
                },
                {
                    headers: {
                        Accept: 'application/vnd.api+json',
                        'Content-Type': 'application/vnd.api+json'
                    },
                    skipAuthorization: true
                }
            );
        });

        describe('promise successful', () => {
            it('should set token', (done) => {
                spyOn($$window.localStorage, 'setItem').and.returnValue();
                $ctrl.convertTicketToJWT('ticket').then(() => {
                    expect($$window.localStorage.setItem).toHaveBeenCalledWith('token', 'json_web_token');
                    done();
                });
            });

            it('should remove redirect', (done) => {
                spyOn($$window.localStorage, 'removeItem').and.returnValue();
                $ctrl.convertTicketToJWT('ticket').then(() => {
                    expect($$window.localStorage.removeItem).toHaveBeenCalledWith('redirect');
                    done();
                });
            });

            it('should remove params', (done) => {
                spyOn($$window.localStorage, 'removeItem').and.returnValue();
                $ctrl.convertTicketToJWT('ticket').then(() => {
                    expect($$window.localStorage.removeItem).toHaveBeenCalledWith('params');
                    done();
                });
            });

            describe('redirect and params set', () => {
                beforeEach(() => {
                    spyOn($$window.localStorage, 'getItem').and.callFake((data) => {
                        if (data === 'params') {
                            return '{"a": "b", "c": "d", "e": "f"}';
                        } else {
                            return '/tools/google';
                        }
                    });
                    spyOn(location, 'search').and.returnValue();
                    spyOn(location, 'path').and.returnValue();
                });

                it('should get redirect', (done) => {
                    $ctrl.convertTicketToJWT('ticket').then(() => {
                        expect($$window.localStorage.getItem).toHaveBeenCalledWith('redirect');
                        done();
                    });
                });

                it('should get params', (done) => {
                    $ctrl.convertTicketToJWT('ticket').then(() => {
                        expect($$window.localStorage.getItem).toHaveBeenCalledWith('params');
                        done();
                    });
                });

                it('should call $location.search', (done) => {
                    $ctrl.convertTicketToJWT('ticket').then(() => {
                        expect(location.search).toHaveBeenCalledWith({ a: 'b', c: 'd', e: 'f' });
                        done();
                    });
                });
            });

            describe('redirect and params not set', () => {
                it('should call state.go', (done) => {
                    $ctrl.convertTicketToJWT('ticket').then(() => {
                        expect(state.go).toHaveBeenCalledWith('home', {}, { reload: true });
                        done();
                    });
                });
            });
        });

        describe('promise rejected', () => {
            beforeEach(() => {
                spy.and.callFake(() => Promise.reject(Error('something went wrong')));
            });

            it('should call state.go', (done) => {
                $ctrl.convertTicketToJWT('ticket').catch(() => {
                    expect(state.go).toHaveBeenCalledWith('logout');
                    done();
                });
            });
        });
    });
});
