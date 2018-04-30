import service from './organization.service';

describe('preferences.integrations.organization.service', () => {
    let _window, preferencesOrganization, api;
    beforeEach(() => {
        angular.mock.module(service);
        inject(($window, _preferencesOrganization_, _api_) => {
            _window = $window;
            preferencesOrganization = _preferencesOrganization_;
            api = _api_;
        });
    });
    describe('oAuth', () => {
        beforeEach(() => {
            api.account_list_id = 'account_list_id';
            spyOn(_window.localStorage, 'getItem').and.returnValue('json_web_token');
        });
        it('should return an organization oAuthUrl', () => {
            expect(preferencesOrganization.oAuth('123')).toEqual(
                '/auth/user/donorhub?'
                + 'account_list_id=account_list_id&'
                + 'redirect_to=http%3A%2F%2Flocalhost%3A8080%2Fpreferences%2Fintegrations%3FselectedTab%3Dorganization&'
                + 'access_token=json_web_token&'
                + 'organization_id=123'
            );
        });
        it('should add custom route', () => {
            expect(preferencesOrganization.oAuth('123', 'setup/connect')).toEqual(
                '/auth/user/donorhub?'
                + 'account_list_id=account_list_id&'
                + 'redirect_to=http%3A%2F%2Flocalhost%3A8080%2Fsetup%2Fconnect&'
                + 'access_token=json_web_token&'
                + 'organization_id=123'
            );
        });
    });
});
