import service from './donorAccounts.service';

describe('common.donorAccounts.service', () => {
    let api, donorAccounts, q;

    beforeEach(() => {
        angular.mock.module(service);
        inject((_api_, _donorAccounts_, $q) => {
            api = _api_;
            donorAccounts = _donorAccounts_;
            q = $q;
            api.account_list_id = 'account_list_id';
        });
    });

    describe('search', () => {
        const keywords = 'my keywords';
        beforeEach(() => {
            spyOn(api, 'get').and.callFake((url, data) => q.resolve(data));
        });

        it('should return a promise', () => {
            expect(donorAccounts.search(keywords)).toEqual(jasmine.any(q));
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
