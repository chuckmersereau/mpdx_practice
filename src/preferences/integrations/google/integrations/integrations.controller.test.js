import integrations from './integrations.controller';

describe('preferences.integrations.google.integrations.controller', () => {
    let $ctrl, controller, scope, api, alerts, gettextCatalog;
    beforeEach(() => {
        angular.mock.module(integrations);
        inject(($controller, $rootScope, _api_, _alerts_, _gettextCatalog_) => {
            scope = $rootScope.$new();
            api = _api_;
            alerts = _alerts_;
            gettextCatalog = _gettextCatalog_;
            // googleAccount = _googleAccount_;
            // googleIntegration = _googleIntegration_;
            controller = $controller;
            $ctrl = loadController();
        });
        spyOn(alerts, 'addAlert').and.callFake((data) => data);
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
            expect(api.put).toHaveBeenCalledWith({
                url: 'user/google_accounts/2/google_integrations/1',
                data: { id: 1 },
                type: 'google_integrations'
            });
        });
        it('should alert success', (done) => {
            spyOn(api, 'put').and.callFake(() => Promise.resolve());
            $ctrl.save().then(() => {
                expect(alerts.addAlert).toHaveBeenCalledWith('Google integration saved.');
                expect(gettextCatalog.getString).toHaveBeenCalledWith('Google integration saved.');
                done();
            });
        });
        it('should alert failure', (done) => {
            spyOn(api, 'put').and.callFake(() => Promise.reject());
            $ctrl.save().catch(() => {
                expect(alerts.addAlert).toHaveBeenCalledWith('Unable to save Google integration.', 'danger');
                expect(gettextCatalog.getString).toHaveBeenCalledWith('Unable to save Google integration.');
                done();
            });
        });
    });
});