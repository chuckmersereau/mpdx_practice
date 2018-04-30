import service from './integrations.service';

describe('preferences.accounts.integrations.google.integrations.service', () => {
    let googleIntegrations, rootScope;
    beforeEach(() => {
        angular.mock.module(service);
        inject(($rootScope, _googleIntegrations_) => {
            rootScope = $rootScope;
            googleIntegrations = _googleIntegrations_;
        });
    });

    xit('should do something', () => {
        expect(googleIntegrations).toEqual(1);
        expect(rootScope).toEqual(1);
    });
});
