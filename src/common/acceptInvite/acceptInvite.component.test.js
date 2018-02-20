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
        it('should translate the error message', () => {
            spyOn(api, 'put').and.callFake(() => Promise.resolve());
            $ctrl.$onInit();
            expect(gettextCatalog.getString).toHaveBeenCalledWith('Unable to accept invite. Try asking the account holder to resend the invite.');
        });
        it('should call the api', () => {
            spyOn(api, 'put').and.callFake(() => Promise.resolve());
            const successMessage = 'Accepted invite to account successfully.';
            const errorMessage = 'Unable to accept invite. Try asking the account holder to resend the invite.';
            $ctrl.$onInit();
            expect(api.put).toHaveBeenCalledWith({
                url: 'account_lists/account_list_id/invites/account_list_invite_id/accept',
                data: {
                    id: 'account_list_invite_id',
                    code: 'abc'
                },
                type: 'account_list_invites',
                errorMessage: errorMessage,
                successMessage: successMessage
            });
            expect(gettextCatalog.getString).toHaveBeenCalledWith(errorMessage);
            expect(gettextCatalog.getString).toHaveBeenCalledWith(successMessage);
        });

        it('should call state.go', (done) => {
            spyOn(api, 'put').and.callFake(() => Promise.resolve());
            $ctrl.$onInit().then(() => {
                expect(state.go).toHaveBeenCalledWith('home');
                done();
            });
        });

        describe('promise rejected', () => {
            it('should call state.go', (done) => {
                spyOn(api, 'put').and.callFake(() => Promise.reject(new Error('something bad happened')));
                $ctrl.$onInit().catch(() => {
                    expect(state.go).toHaveBeenCalledWith('home');
                    done();
                });
            });
        });

        it('should handle empty conditions', (done) => {
            $ctrl.$stateParams.code = '';
            $ctrl.$onInit().catch(() => {
                expect(gettextCatalog.getString).toHaveBeenCalledWith('Unable to accept invite. Try asking the account holder to resend the invite.');
                expect(alerts.addAlert).toHaveBeenCalledWith('Unable to accept invite. Try asking the account holder to resend the invite.', 'danger', null, 10);
                done();
            });
        });
    });
});
