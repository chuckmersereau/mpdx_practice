import add from './add.controller';

describe('contacts.sidebar.tags.add.controller', () => {
    let $ctrl, scope, api, rootScope, contactsTags, q;
    beforeEach(() => {
        angular.mock.module(add);
        inject(($controller, $rootScope, _api_, _contactsTags_, $q) => {
            rootScope = $rootScope;
            scope = $rootScope.$new();
            scope.$hide = () => {};
            api = _api_;
            api.account_list_id = 123;
            contactsTags = _contactsTags_;
            q = $q;
            $ctrl = $controller('addTagController as $ctrl', {
                $scope: scope,
                selectedContacts: []
            });
        });
    });

    describe('save', () => {
        it('should save a custom tag', (done) => {
            $ctrl.tags = [];
            spyOn(api, 'post').and.callFake(() => q.resolve());
            $ctrl.save('a').then(() => {
                expect(api.post).toHaveBeenCalledWith({
                    url: 'contacts/tags/bulk',
                    data: {
                        data: [{
                            data: {
                                type: 'tags',
                                attributes: { name: 'a' }
                            }
                        }],
                        filter: {
                            account_list_id: 123,
                            contact_ids: ''
                        },
                        fields: {
                            contacts: ''
                        }
                    },
                    doSerialization: false,
                    autoParams: false
                });
                done();
            });
            rootScope.$digest();
        });

        it('should add tag', (done) => {
            $ctrl.tags = [];
            spyOn(api, 'post').and.callFake(() => q.resolve());
            spyOn(rootScope, '$emit').and.callFake(() => {});
            spyOn(contactsTags, 'addTag').and.callFake(() => {});
            $ctrl.save('a').then(() => {
                expect(rootScope.$emit).toHaveBeenCalledWith('contactTagsAdded', { tags: ['a'], contactIds: [] });
                expect(contactsTags.addTag).toHaveBeenCalledWith({ tags: ['a'], contactIds: [] });
                done();
            });
            rootScope.$digest();
        });

        it('should hide', (done) => {
            $ctrl.tags = [];
            spyOn(api, 'post').and.callFake(() => q.resolve());
            spyOn(rootScope, '$emit').and.callFake(() => {});
            spyOn(contactsTags, 'addTag').and.callFake(() => {});
            spyOn(scope, '$hide').and.callFake(() => {});
            $ctrl.save('a').then(() => {
                expect(scope.$hide).toHaveBeenCalledWith();
                done();
            });
            rootScope.$digest();
        });
    });
});