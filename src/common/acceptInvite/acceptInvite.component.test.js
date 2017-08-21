import component from './acceptInvite.component';

describe('common.acceptInvite.component', () => {
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
            $ctrl = componentController('acceptInvite', { $scope: scope });
        });
        spyOn(gettextCatalog, 'getString').and.callThrough();
        spyOn(alerts, 'addAlert').and.callFake((data) => data);
        spyOn(state, 'go').and.callThrough();
        $ctrl.$stateParams = {
            code: 'abc',
            id: 'account_list_invite_id',
            account_list_id: 'account_list_id'
        };
    });

    describe('$onInit', () => {
        it('should return promise', () => {
            spyOn(api, 'put').and.callFake(() => Promise.resolve());
            expect($ctrl.$onInit()).toEqual(jasmine.any(Promise));
        });

        it('should call the api', () => {
            spyOn(api, 'put').and.callFake(() => Promise.resolve());
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

        it('should call alert', (done) => {
            spyOn(api, 'put').and.callFake(() => Promise.resolve());
            $ctrl.$onInit().then(() => {
                expect(alerts.addAlert).toHaveBeenCalledWith(jasmine.any(String));
                expect(gettextCatalog.getString).toHaveBeenCalledWith(jasmine.any(String));
                done();
            });
        });

        it('should call state.go', (done) => {
            spyOn(api, 'put').and.callFake(() => Promise.resolve());
            $ctrl.$onInit().then(() => {
                expect(state.go).toHaveBeenCalledWith('home');
                done();
            });
        });

        describe('promise rejected', () => {
            it('should call alert', (done) => {
                spyOn(api, 'put').and.callFake(() => Promise.reject(new Error('something bad happened')));
                $ctrl.$onInit().catch(() => {
                    expect(alerts.addAlert).toHaveBeenCalledWith(jasmine.any(String), 'danger', null, 10);
                    expect(gettextCatalog.getString).toHaveBeenCalledWith(jasmine.any(String));
                    done();
                });
            });

            it('should call state.go', (done) => {
                spyOn(api, 'put').and.callFake(() => Promise.reject(new Error('something bad happened')));
                $ctrl.$onInit().catch(() => {
                    expect(state.go).toHaveBeenCalledWith('home');
                    done();
                });
            });
        });
    });
});
