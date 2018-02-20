import service from './google.service';

const accountListId = 123;

describe('preferences.integrations.google.service', () => {
    let api, google;
    beforeEach(() => {
        angular.mock.module(service);
        inject(($rootScope, _google_, _api_) => {
            api = _api_;
            google = _google_;
            api.account_list_id = accountListId;
        });
    });
    describe('load', () => {
        it('should build the google oAuth link', (done) => {
            spyOn(api, 'get').and.callFake(() => Promise.resolve());
            google.load(true).then(() => {
                expect(google.oAuth).toBeDefined();
                done();
            });
        });
        it('should query the API', (done) => {
            spyOn(api, 'get').and.callFake(() => Promise.resolve());
            google.load(true).then(() => {
                expect(api.get).toHaveBeenCalledWith('user/google_accounts', {
                    sort: 'created_at',
                    include: 'contact_groups'
                });
                done();
            });
        });
        it('find failures', (done) => {
            spyOn(api, 'get').and.callFake(() => Promise.resolve([
                { token_failure: true }
            ]));
            google.load(true).then(() => {
                expect(google.failure).toBeTruthy();
                done();
            });
        });
        it('find no failures', (done) => {
            spyOn(api, 'get').and.callFake(() => Promise.resolve([
                {}
            ]));
            google.load(true).then(() => {
                expect(google.failure).toBeFalsy();
                done();
            });
        });
        it('should cache results', (done) => {
            google.data = [{}];
            google.load().then(() => {
                expect(google.data.length).toBe(1);
                done();
            });
        });
    });
    describe('disconnect', () => {
        it('should delete the relationship', (done) => {
            spyOn(api, 'delete').and.callFake(() => Promise.resolve());
            spyOn(google, 'load').and.callFake(() => Promise.resolve());
            google.disconnect(123, 'a', 'b').then(() => {
                expect(api.delete).toHaveBeenCalledWith({
                    url: 'user/google_accounts/123',
                    type: 'google_accounts',
                    successMessage: 'a',
                    errorMessage: 'b'
                });
                done();
            });
        });
        it('should re-load list after delete', (done) => {
            spyOn(api, 'delete').and.callFake(() => Promise.resolve());
            spyOn(google, 'load').and.callFake(() => Promise.resolve());
            google.disconnect(123).then(() => {
                expect(google.load).toHaveBeenCalledWith(true);
                done();
            });
        });
    });
});