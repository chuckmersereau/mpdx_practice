import service from './contacts.service';
import assign from 'lodash/fp/assign';

const accountListId = 123;
const defaultParams = {};
const params = {a: 'b'};
const tags = [{name: 'a'}, {name: 'b'}];

describe('contacts.service', () => {
    let api, contacts, contactFilter, contactsTags, rootScope;
    beforeEach(() => {
        angular.mock.module(service);
        inject(($rootScope, _api_, _contacts_, _contactFilter_, _contactsTags_) => {
            rootScope = $rootScope;
            api = _api_;
            contacts = _contacts_;
            contactFilter = _contactFilter_;
            contactsTags = _contactsTags_;
            api.account_list_id = accountListId;
        });
        spyOn(api, 'get').and.callFake((data) => new Promise(resolve => resolve(data)));
        spyOn(api, 'put').and.callFake((data) => new Promise(resolve => resolve(data)));
        spyOn(rootScope, '$emit').and.callThrough();
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
    describe('getNames', () => {
        it('should query an array of ids for names', () => {
            contacts.getNames([1, 2]);
            expect(api.get).toHaveBeenCalledWith('contacts', {
                fields: { contacts: 'name' },
                filter: { ids: '1,2' }
            });
        });
    });
    describe('save', () => {
        let contact = {id: 1, name: 'a'};
        it('should save a contact', () => {
            contacts.save(contact);
            expect(api.put).toHaveBeenCalledWith(`contacts/${contact.id}`, contact);
        });
        it('should change tag_list array to comma delim list', () => {
            contact.tag_list = ['tag1', 'tag2'];
            contacts.save(contact);
            expect(api.put).toHaveBeenCalledWith(`contacts/${contact.id}`, assign(contact, {tag_list: 'tag1,tag2'}));
        });
        it('should trigger contactCreated if name changed', done => {
            contacts.save(contact).then(() => {
                expect(rootScope.$emit).toHaveBeenCalledWith('contactCreated');
                done();
            });
        });
        it('should return the server response', done => {
            contacts.save(contact).then(data => {
                expect(data).toBeDefined();
                done();
            });
        });
    });
});