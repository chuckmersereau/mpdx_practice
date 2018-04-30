import service from './google.service';

const accountListId = 123;

describe('preferences.integrations.google.service', () => {
    let api, google, q, rootScope;
    beforeEach(() => {
        angular.mock.module(service);
        inject(($rootScope, _google_, _api_, $q) => {
            api = _api_;
            google = _google_;
            q = $q;
            rootScope = $rootScope;
            api.account_list_id = accountListId;
        });
    });
    describe('load', () => {
        it('should build the google oAuth link', (done) => {
            spyOn(api, 'get').and.callFake(() => q.resolve());
            google.load(true).then(() => {
                expect(google.oAuth).toBeDefined();
                done();
            });
            rootScope.$digest();
        });
        it('should query the API', (done) => {
            spyOn(api, 'get').and.callFake(() => q.resolve());
            google.load(true).then(() => {
                expect(api.get).toHaveBeenCalledWith('user/google_accounts', {
                    sort: 'created_at',
                    include: 'contact_groups'
                });
                done();
            });
            rootScope.$digest();
        });
        it('find failures', (done) => {
            spyOn(api, 'get').and.callFake(() => q.resolve([
                { token_failure: true }
            ]));
            google.load(true).then(() => {
                expect(google.failure).toBeTruthy();
                done();
            });
            rootScope.$digest();
        });
        it('find no failures', (done) => {
            spyOn(api, 'get').and.callFake(() => q.resolve([
                {}
            ]));
            google.load(true).then(() => {
                expect(google.failure).toBeFalsy();
                done();
            });
            rootScope.$digest();
        });
        it('should cache results', (done) => {
            google.data = [{}];
            google.load().then(() => {
                expect(google.data.length).toBe(1);
                done();
            });
            rootScope.$digest();
        });
    });
    describe('disconnect', () => {
        it('should delete the relationship', (done) => {
            spyOn(api, 'delete').and.callFake(() => q.resolve());
            spyOn(google, 'load').and.callFake(() => q.resolve());
            google.disconnect(123, 'a', 'b').then(() => {
                expect(api.delete).toHaveBeenCalledWith({
                    url: 'user/google_accounts/123',
                    type: 'google_accounts',
                    successMessage: 'a',
                    errorMessage: 'b'
                });
                done();
            });
            rootScope.$digest();
        });
        it('should re-load list after delete', (done) => {
            spyOn(api, 'delete').and.callFake(() => q.resolve());
            spyOn(google, 'load').and.callFake(() => q.resolve());
            google.disconnect(123).then(() => {
                expect(google.load).toHaveBeenCalledWith(true);
                done();
            });
            rootScope.$digest();
        });
    });
});