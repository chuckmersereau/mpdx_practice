import service from './appeals.service';

describe('common.appeals.service', () => {
    let api, appeals;
    beforeEach(() => {
        angular.mock.module(service);
        inject(($rootScope, _api_, _appeals_) => {
            appeals = _appeals_;
            api = _api_;
            api.account_list_id = 123;
        });
    });

    describe('getCount', () => {
        const result = {meta: {pagination: {total_count: 1}}};

        beforeEach(() => {
            spyOn(api, 'get').and.callFake(() => Promise.resolve(result));
        });

        it('should query api for a count and return it', (done) => {
            appeals.getCount().then(data => {
                expect(data).toBe(1);
                done();
            });
            expect(api.get).toHaveBeenCalledWith('appeals', {
                fields: {appeals: ''},
                filter: {account_list_id: api.account_list_id},
                per_page: 0
            });
        });
    });

    describe('getCount - no results', () => {
        beforeEach(() => {
            spyOn(api, 'get').and.callFake(() => Promise.resolve({}));
        });

        it('should query api for a count and return it', (done) => {
            appeals.getCount().then(data => {
                expect(data).toBe(0);
                done();
            });
            expect(api.get).toHaveBeenCalledWith('appeals', {
                fields: {appeals: ''},
                filter: {account_list_id: api.account_list_id},
                per_page: 0
            });
        });
    });

    describe('search', () => {
        const keywords = 'my keywords';
        beforeEach(() => {
            spyOn(api, 'get').and.callFake((url, data) => Promise.resolve(data));
        });

        it('should return a promise', () => {
            expect(appeals.search(keywords)).toEqual(jasmine.any(Promise));
        });

        it('should call api.get', () => {
            appeals.search(keywords);
            expect(api.get).toHaveBeenCalledWith(
                'appeals',
                {
                    filter: {
                        wildcard_search: keywords,
                        account_list_id: api.account_list_id
                    },
                    fields: {
                        appeals: 'name'
                    },
                    per_page: 6
                }
            );
        });
    });
});
