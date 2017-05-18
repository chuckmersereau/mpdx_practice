import service from './filter.service';

const accountListId = 123;

describe('contacts.sidebar.filter.service', () => {
    let api, filters, contactFilter, contactsTags, rootScope;
    beforeEach(() => {
        angular.mock.module(service);
        inject(($rootScope, _api_, _filters_, _contactFilter_, _contactsTags_) => {
            rootScope = $rootScope;
            api = _api_;
            filters = _filters_;
            contactFilter = _contactFilter_;
            contactsTags = _contactsTags_;
            api.account_list_id = accountListId;
        });
    });
    describe('reset', () => {
        it('should reset wildcard search', () => {
            contactFilter.wildcard_search = 'abc';
            contactFilter.reset();
            expect(contactFilter.wildcard_search).toEqual('');
        });
    });
    describe('isResettable', () => {
        beforeEach(() => {
            contactFilter.wildcard_search = '';
        });
        it(`shouldn't be resettable if default conditions are met`, () => { //incomplete test
            expect(contactFilter.isResettable()).toBeFalsy();
        });
        it(`should be resettable if wildcard isn't empty`, () => {
            contactFilter.wildcard_search = 'abc';
            expect(contactFilter.isResettable()).toBeTruthy();
        });
    });
});