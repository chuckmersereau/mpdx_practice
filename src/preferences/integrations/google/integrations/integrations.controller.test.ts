import integrations from './integrations.controller';

describe('preferences.integrations.google.integrations.controller', () => {
    let $ctrl, scope, api, gettextCatalog, q;
    beforeEach(() => {
        angular.mock.module(integrations);
        inject(($controller, $rootScope, _api_, _gettextCatalog_, $q) => {
            scope = $rootScope.$new();
            api = _api_;
            gettextCatalog = _gettextCatalog_;
            q = $q;
            $ctrl = $controller('googleIntegrationsModalController as $ctrl', {
                $scope: scope,
                googleIntegration: { id: 1 },
                googleAccount: { id: 2 }
            });
        });
        spyOn(gettextCatalog, 'getString').and.callThrough();
    });

    describe('save', () => {
        it('should put to the api', () => {
            spyOn(api, 'put').and.callFake(() => q.resolve());
            $ctrl.save();
            const errorMessage = 'Unable to save Google integration.';
            const successMessage = 'Google integration saved.';
            expect(gettextCatalog.getString).toHaveBeenCalledWith(successMessage);
            expect(gettextCatalog.getString).toHaveBeenCalledWith(errorMessage);
            expect(api.put).toHaveBeenCalledWith({
                url: 'user/google_accounts/2/google_integrations/1',
                data: { id: 1 },
                type: 'google_integrations',
                successMessage: successMessage,
                errorMessage: errorMessage
            });
        });
    });
});