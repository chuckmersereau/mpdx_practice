import component from './mailchimp.service';

describe('preferences.integrations.mailchimp.service', () => {
    let mailchimp, api, q, rootScope;
    beforeEach(() => {
        angular.mock.module(component);
        inject((_mailchimp_, _api_, $q, $rootScope) => {
            api = _api_;
            mailchimp = _mailchimp_;
            q = $q;
            rootScope = $rootScope;
            api.account_list_id = 123;
        });
    });

    describe('load', () => {
        beforeEach(() => {
            spyOn(api, 'get').and.callFake(() => q.resolve(['data']));
        });

        it('should call the api', () => {
            mailchimp.load();
            expect(api.get).toHaveBeenCalledWith({
                url: 'account_lists/123/mail_chimp_account',
                overridePromise: true
            });
        });

        it('should set the mailchimp service data', (done) => {
            mailchimp.load().then(() => {
                expect(mailchimp.data).toEqual(['data']);
                done();
            });
            rootScope.$digest();
        });
    });
});