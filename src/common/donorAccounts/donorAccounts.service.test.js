import service from './donorAccounts.service';

describe('common.donorAccounts.service', () => {
    let api, donorAccounts;

    beforeEach(() => {
        angular.mock.module(service);
        inject((_api_, _donorAccounts_) => {
            api = _api_;
            donorAccounts = _donorAccounts_;
            api.account_list_id = 'account_list_id';
        });
    });

    describe('search', () => {
        const keywords = 'my keywords';
        beforeEach(() => {
            spyOn(api, 'get').and.callFake((url, data) => Promise.resolve(data));
        });

        it('should return a promise', () => {
            expect(donorAccounts.search(keywords)).toEqual(jasmine.any(Promise));
        });

        it('should call api.get', () => {
            donorAccounts.search(keywords);
            expect(api.get).toHaveBeenCalledWith(
                'account_lists/account_list_id/donor_accounts',
                {
                    filter: {
                        wildcard_search: keywords
                    },
                    fields: {
                        donor_accounts: 'display_name,account_number'
                    },
                    per_page: 6
                }
            );
        });
    });
});
