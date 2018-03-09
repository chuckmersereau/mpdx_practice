import service from './prayerLetters.service';

describe('preferences.accounts.integrations.prayerLetters.service', () => {
    let prayerLetters, api;
    beforeEach(() => {
        angular.mock.module(service);
        inject((_prayerLetters_, _api_) => {
            api = _api_;
            prayerLetters = _prayerLetters_;
            api.account_list_id = 123;
        });
    });

    describe('load', () => {
        beforeEach(() => {
            spyOn(api, 'get').and.callFake(() => Promise.resolve(['data']));
        });
        it('should call the api', () => {
            prayerLetters.load();
            expect(api.get).toHaveBeenCalledWith({
                url: 'account_lists/123/prayer_letters_account',
                overridePromise: true
            });
        });
        it('should set the prayerLetters service data', (done) => {
            prayerLetters.load().then(() => {
                expect(prayerLetters.data).toEqual(['data']);
                done();
            });
        });
    });
});
