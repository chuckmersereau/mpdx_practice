import service from './integrations.service';

describe('preferences.integrations.service', () => {
    let integrations, rootScope;
    beforeEach(() => {
        angular.mock.module(service);
        inject(($rootScope, _integrations_) => {
            rootScope = $rootScope;
            integrations = _integrations_;
        });
    });

    xit('should do something', () => {
        expect(integrations).toEqual(1);
        expect(rootScope).toEqual(1);
    });
});
