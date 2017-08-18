import component from './mailchimp.service';

describe('preferences.integrations.mailchimp.service', () => {
    let mailchimp, api;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, _mailchimp_, _api_) => {
            api = _api_;
            mailchimp = _mailchimp_;
            api.account_list_id = 123;
        });
    });
    describe('load', () => {
        beforeEach(() => {
            spyOn(api, 'get').and.callFake(() => Promise.resolve(['data']));
        });
        it('should call the api', () => {
            mailchimp.load();
            expect(api.get).toHaveBeenCalledWith('account_lists/123/mail_chimp_account');
        });
        it('should set the mailchimp service data', done => {
            mailchimp.load().then(() => {
                expect(mailchimp.data).toEqual(['data']);
                done();
            });
        });
    });
});