import service from './prayerLetters.service';

describe('preferences.accounts.integrations.prayerLetters.service', () => {
    let prayerLetters, rootScope;
    beforeEach(() => {
        angular.mock.module(service);
        inject(($rootScope, _prayerLetters_) => {
            rootScope = $rootScope;
            prayerLetters = _prayerLetters_;
        });
    });

    xit('should do something', () => {
        expect(prayerLetters).toEqual(1);
        expect(rootScope).toEqual(1);
    });
});
