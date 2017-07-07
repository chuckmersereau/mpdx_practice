import component from './acceptInvite.component';

describe('tools.component', () => {
    let $ctrl, componentController, scope, rootScope, state, gettextCatalog, alerts, api;

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, $state, _gettextCatalog_, _alerts_, _api_) => {
            componentController = $componentController;
            rootScope = $rootScope;
            scope = rootScope.$new();
            state = $state;
            gettextCatalog = _gettextCatalog_;
            alerts = _alerts_;
            api = _api_;
            loadController();
            spyOn(gettextCatalog, 'getString').and.callThrough();
            spyOn(alerts, 'addAlert').and.callFake(data => data);
            spyOn(state, 'go').and.callThrough();
        });
    });

    function loadController() {
        $ctrl = componentController('acceptInvite', { $scope: scope });
    }

    describe('$onInit', () => {
        let spy;

        beforeEach(() => {
            spy = spyOn(api, 'put').and.callFake(() => Promise.resolve());
        });

        it('should return promise', () => {
            expect($ctrl.$onInit()).toEqual(jasmine.any(Promise));
        });

        describe('code, id and account_list_id set', () => {
            beforeEach(() => {
                $ctrl.$stateParams = {
                    code: 'abc',
                    id: 'account_list_invite_id',
                    account_list_id: 'account_list_id'
                };
            });

            it('should call the api', () => {
                $ctrl.$onInit();
                expect(api.put).toHaveBeenCalledWith({
                    url: 'account_lists/account_list_id/invites/account_list_invite_id/accept',
                    data: {
                        id: 'account_list_invite_id',
                        code: 'abc'
                    },
                    type: 'account_list_invites'
                });
            });

            describe('promise successful', () => {
                it('should call alert', (done) => {
                    $ctrl.$onInit().then(() => {
                        expect(alerts.addAlert).toHaveBeenCalledWith(jasmine.any(String));
                        expect(gettextCatalog.getString).toHaveBeenCalledWith(jasmine.any(String));
                        done();
                    });
                });

                it('should call state.go', (done) => {
                    $ctrl.$onInit().then(() => {
                        expect(state.go).toHaveBeenCalledWith('home');
                        done();
                    });
                });
            });

            describe('promise rejected', () => {
                beforeEach(() => {
                    spy.and.callFake(() => Promise.reject(new Error('something bad happened')));
                });

                it('should call alert', (done) => {
                    $ctrl.$onInit().catch(() => {
                        expect(alerts.addAlert).toHaveBeenCalledWith(jasmine.any(String), 'danger', null, 10);
                        expect(gettextCatalog.getString).toHaveBeenCalledWith(jasmine.any(String));
                        done();
                    });
                });

                it('should call state.go', (done) => {
                    $ctrl.$onInit().catch(() => {
                        expect(state.go).toHaveBeenCalledWith('home');
                        done();
                    });
                });
            });
        });

        describe('code, id and account_list_id not set', () => {
            it('should call alert', (done) => {
                $ctrl.$onInit().catch(() => {
                    expect(alerts.addAlert).toHaveBeenCalledWith(jasmine.any(String), 'danger', null, 10);
                    expect(gettextCatalog.getString).toHaveBeenCalledWith(jasmine.any(String));
                    done();
                });
            });

            it('should call state.go', (done) => {
                $ctrl.$onInit().catch(() => {
                    expect(state.go).toHaveBeenCalledWith('home');
                    done();
                });
            });
        });
    });
});
