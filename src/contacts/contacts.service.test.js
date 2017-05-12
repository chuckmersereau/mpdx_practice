import service from './contacts.service';
import assign from 'lodash/fp/assign';

const accountListId = 123;
const defaultParams = {};
const params = {a: 'b'};
const tags = [{name: 'a'}, {name: 'b'}];

describe('contacts.service', () => {
    let api, contacts, contactFilter, contactsTags, scope;
    beforeEach(() => {
        angular.mock.module(service);
        inject(($rootScope, _api_, _contacts_, _contactFilter_, _contactsTags_) => {
            scope = $rootScope.$new();
            api = _api_;
            contacts = _contacts_;
            contactFilter = _contactFilter_;
            contactsTags = _contactsTags_;
            api.account_list_id = accountListId;
        });
    });
    describe('buildFilterParams', () => {
        const defaultResult = assign(params, {account_list_id: accountListId, any_tags: false});
        beforeEach(() => {
            contactFilter.default_params = defaultParams;
            contactFilter.params = params;
        });
        it('should handle default params', () => {
            expect(contacts.buildFilterParams()).toEqual(defaultResult);
        });
        it('should handle wildcard search', () => {
            contactFilter.wildcard_search = 'abc';
            expect(contacts.buildFilterParams()).toEqual(assign(defaultResult, {wildcard_search: 'abc'}));
            contactFilter.wildcard_search = null;
        });
        it('should handle tags', () => {
            contactsTags.selectedTags = tags;
            expect(contacts.buildFilterParams()).toEqual(assign(defaultResult, {tags: 'a,b'}));
            contactFilter.selectedTags = [];
        });
        it('should handle tag exclusions', () => {
            contactsTags.rejectedTags = tags;
            expect(contacts.buildFilterParams()).toEqual(assign(defaultResult, {exclude_tags: 'a,b'}));
            contactFilter.rejectedTags = [];
        });
    });
});