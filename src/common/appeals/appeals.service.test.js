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
    describe('getList', () => {
        const result = [];
        beforeEach(() => {
            spyOn(api, 'get').and.callFake(() => Promise.resolve(result));
        });
        it('should query api for a list and return it', (done) => {
            appeals.getList().then(data => {
                expect(data).toBe(result);
                done();
            });
            expect(api.get).toHaveBeenCalledWith('appeals', {
                fields: {appeals: 'name'},
                filter: {account_list_id: api.account_list_id},
                per_page: 1000
            });
        });
    });
});