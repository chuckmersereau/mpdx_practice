import service from './tags.service';

const accountListId = 123;
const result = ['a'];
const tag = { name: 'a' };

describe('contacts.service', () => {
    let api, contactsTags, rootScope, q;
    beforeEach(() => {
        angular.mock.module(service);
        inject(($rootScope, _api_, _contactsTags_, $q) => {
            rootScope = $rootScope;
            api = _api_;
            q = $q;
            api.account_list_id = accountListId;
            contactsTags = _contactsTags_;
        });
        spyOn(api, 'get').and.callFake(() => q.resolve(result));
    });

    describe('load', () => {
        it('should query the api', (done) => {
            contactsTags.load().then(() => {
                expect(api.get).toHaveBeenCalledWith('contacts/tags', { filter: { account_list_id: accountListId } });
                done();
            });
            rootScope.$digest();
        });

        it('should set and return data', (done) => {
            contactsTags.load().then((data) => {
                expect(contactsTags.data).toEqual(result);
                expect(data).toEqual(result);
                done();
            });
            rootScope.$digest();
        });
    });

    describe('addTag', () => {
        it('should add a tag to data', () => {
            contactsTags.data = [{ name: 'a' }];
            contactsTags.addTag({ tags: ['b'] });
            expect(contactsTags.data[1].name).toEqual('b');
        });
    });

    describe('tagClick', () => {
        beforeEach(() => {
            contactsTags.selectedTags = [];
            contactsTags.rejectedTags = [];
            spyOn(contactsTags, 'change').and.callFake(() => {});
            spyOn(contactsTags, 'selectTag').and.callFake(() => {});
        });

        it('should handle a selected tag', () => {
            contactsTags.selectedTags = [tag];
            contactsTags.tagClick(tag);
            expect(contactsTags.selectedTags).toEqual([]);
            expect(contactsTags.rejectedTags).toEqual([tag]);
            expect(contactsTags.change).toHaveBeenCalledWith();
        });

        it('should handle a rejected tag', () => {
            contactsTags.rejectedTags = [tag];
            contactsTags.tagClick(tag);
            expect(contactsTags.selectedTags).toEqual([]);
            expect(contactsTags.rejectedTags).toEqual([]);
            expect(contactsTags.change).toHaveBeenCalledWith();
        });

        it('should handle an unselected tag', () => {
            contactsTags.tagClick(tag);
            expect(contactsTags.selectTag).toHaveBeenCalledWith(tag);
        });
    });

    describe('selectTag', () => {
        const initialSelectedTag = { name: 'b' };
        const initialSelectedTag2 = { name: 'c' };
        beforeEach(() => {
            contactsTags.selectedTags = [initialSelectedTag, initialSelectedTag2];
            contactsTags.rejectedTags = [tag];
            spyOn(contactsTags, 'change').and.callFake(() => {});
        });

        it('should select tag', () => {
            contactsTags.selectTag(tag);
            expect(contactsTags.selectedTags).toEqual([initialSelectedTag, initialSelectedTag2, tag]);
        });

        it('should deselect tag from reject list', () => {
            contactsTags.selectTag(tag);
            expect(contactsTags.rejectedTags).toEqual([]);
        });

        it('should call change', () => {
            contactsTags.selectTag(tag);
            expect(contactsTags.change).toHaveBeenCalledWith();
        });
    });

    describe('rejectTag', () => {
        beforeEach(() => {
            contactsTags.rejectedTags = [];
            contactsTags.selectedTags = [tag];
            spyOn(contactsTags, 'change').and.callFake(() => {});
        });

        it('should reject tag', () => {
            contactsTags.rejectTag(tag);
            expect(contactsTags.rejectedTags).toEqual([tag]);
        });

        it('should deselect tag from selected list', () => {
            contactsTags.rejectTag(tag);
            expect(contactsTags.selectedTags).toEqual([]);
        });

        it('should call change', () => {
            contactsTags.rejectTag(tag);
            expect(contactsTags.change).toHaveBeenCalledWith();
        });
    });

    describe('removeFromRejected', () => {
        beforeEach(() => {
            spyOn(contactsTags, 'change').and.callFake(() => {});
            contactsTags.rejectedTags = [tag];
        });

        it('should remove tag from rejected list', () => {
            contactsTags.removeFromRejected(tag);
            expect(contactsTags.rejectedTags).toEqual([]);
        });

        it('should call change', () => {
            contactsTags.removeFromRejected(tag);
            expect(contactsTags.change).toHaveBeenCalledWith();
        });
    });

    describe('removeFromSelected', () => {
        beforeEach(() => {
            spyOn(contactsTags, 'change').and.callFake(() => {});
            contactsTags.selectedTags = [tag];
        });

        it('should remove tag from rejected list', () => {
            contactsTags.removeFromSelected(tag);
            expect(contactsTags.selectedTags).toEqual([]);
        });

        it('should call change', () => {
            contactsTags.removeFromSelected(tag);
            expect(contactsTags.change).toHaveBeenCalledWith();
        });
    });

    describe('change', () => {
        it('should emit contactsTagsChange', () => {
            spyOn(rootScope, '$emit').and.callFake(() => {});
            contactsTags.change();
            expect(rootScope.$emit).toHaveBeenCalledWith('contactsTagsChange');
        });
    });
});