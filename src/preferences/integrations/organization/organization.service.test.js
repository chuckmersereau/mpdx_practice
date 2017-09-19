import service from './organization.service';

describe('preferences.integrations.organization.service', () => {
    let preferencesOrganization, rootScope;
    beforeEach(() => {
        angular.mock.module(service);
        inject(($rootScope, _preferencesOrganization_) => {
            rootScope = $rootScope;
            preferencesOrganization = _preferencesOrganization_;
        });
    });

    xit('should do something', () => {
        expect(preferencesOrganization).toEqual(1);
        expect(rootScope).toEqual(1);
    });
});
