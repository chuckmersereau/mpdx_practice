import service from './appeals.service';

describe('tools.appeals.service', () => {
    let appeals, accounts, api;

    beforeEach(() => {
        angular.mock.module(service);
        inject(($rootScope, _appeals_, _accounts_, _api_) => {
            accounts = _accounts_;
            appeals = _appeals_;
            api = _api_;
        });
    });
    describe('appealSearch', () => {
        it('should query the api', () => {
            spyOn(api, 'get').and.callFake(() => Promise.resolve());
            appeals.appealSearch('a');
            expect(api.get).toHaveBeenCalledWith({
                url: 'appeals',
                data: {
                    filter: {
                        account_list_id: api.account_list_id,
                        wildcard_search: 'a'
                    },
                    fields: {
                        appeals: 'name'
                    },
                    per_page: 6
                },
                overrideGetAsPost: true
            });
        });
    });
    describe('setPrimaryAppeal', () => {
        beforeEach(() => {
            accounts.current = { primary_appeal: null };
            spyOn(appeals, 'gettext').and.callFake((data) => data);
        });
        it('should add the contact to the appeal', () => {
            spyOn(accounts, 'saveCurrent').and.callFake(() => Promise.resolve());
            const successMessage = 'Appeal successfully set to primary';
            const errorMessage = 'Unable to set Appeal as primary';
            appeals.setPrimaryAppeal({ id: 1 });
            expect(accounts.saveCurrent).toHaveBeenCalledWith(successMessage, errorMessage);
            expect(appeals.gettext).toHaveBeenCalledWith(successMessage);
            expect(appeals.gettext).toHaveBeenCalledWith(errorMessage);
        });
    });
});
