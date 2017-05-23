import service from './tags.service';

const accountListId = 123;

describe('contacts.service', () => {
    let api, contactsTags, gettextCatalog, modal, rootScope;
    beforeEach(() => {
        angular.mock.module(service);
        inject(($rootScope, _api_, _contactsTags_, _gettextCatalog_, _modal_) => {
            rootScope = $rootScope;
            api = _api_;
            api.account_list_id = accountListId;
            gettextCatalog = _gettextCatalog_;
            modal = _modal_;
            contactsTags = _contactsTags_;
        });
        spyOn(api, 'get').and.callFake((data) => Promise.resolve(data));
        spyOn(api, 'put').and.callFake((data) => Promise.resolve(data));
        spyOn(api, 'delete').and.callFake(() => Promise.resolve({}));
    });
    describe('untagContact', () => {
        beforeEach(() => {
            spyOn(modal, 'confirm').and.callFake(() => Promise.resolve({}));
            spyOn(contactsTags, 'load').and.callFake(() => Promise.resolve());
            spyOn(gettextCatalog, 'getString').and.callFake(() => '');
            spyOn(rootScope, '$emit').and.callThrough();
        });
        it('should confirm a translated message', () => {
            contactsTags.untagContact([]);
            expect(gettextCatalog.getString).toHaveBeenCalledWith(jasmine.any(String));
            expect(modal.confirm).toHaveBeenCalledWith(jasmine.any(String));
        });
        it('should remove a tag', (done) => {
            contactsTags.untagContact([], 'a').then(() => {
                expect(api.delete).toHaveBeenCalledWith({
                    url: 'contacts/tags/bulk',
                    params: {
                        filter: {
                            account_list_id: api.account_list_id,
                            contact_ids: null
                        }
                    },
                    data: [{
                        name: 'a'
                    }],
                    type: 'tags'
                });
                done();
            });
        });
        it('should remove a tag from specific contacts', (done) => {
            contactsTags.untagContact([1, 2], 'a').then(() => {
                expect(api.delete).toHaveBeenCalledWith({
                    url: 'contacts/tags/bulk',
                    params: {
                        filter: {
                            account_list_id: api.account_list_id,
                            contact_ids: '1,2'
                        }
                    },
                    data: [{
                        name: 'a'
                    }],
                    type: 'tags'
                });
                done();
            });
        });
        it('should broadcast when complete', (done) => {
            contactsTags.untagContact([], 'a').then(() => {
                expect(rootScope.$emit).toHaveBeenCalledWith('contactTagDeleted', {tag: 'a', contactIds: []});
                done();
            });
        });
        it('should reload tags when finished', (done) => {
            contactsTags.untagContact([], 'a').then(() => {
                expect(contactsTags.load).toHaveBeenCalled();
                done();
            });
        });
    });
});