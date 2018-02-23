import integrations from './integrations.controller';

describe('preferences.integrations.google.integrations.controller', () => {
    let $ctrl, controller, scope, api, gettextCatalog;
    beforeEach(() => {
        angular.mock.module(integrations);
        inject(($controller, $rootScope, _api_, _gettextCatalog_) => {
            scope = $rootScope.$new();
            api = _api_;
            gettextCatalog = _gettextCatalog_;
            // googleAccount = _googleAccount_;
            // googleIntegration = _googleIntegration_;
            controller = $controller;
            $ctrl = loadController();
        });
        spyOn(gettextCatalog, 'getString').and.callThrough();
    });

    function loadController() {
        return controller('googleIntegrationsModalController as $ctrl', {
            $scope: scope,
            googleIntegration: { id: 1 },
            googleAccount: { id: 2 }
        });
    }
    describe('save', () => {
        it('should put to the api', () => {
            spyOn(api, 'put').and.callFake(() => Promise.resolve());
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