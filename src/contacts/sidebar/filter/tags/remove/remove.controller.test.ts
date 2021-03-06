import remove from './remove.controller';

describe('contacts.sidebar.tags.remove.controller', () => {
    let $ctrl, controller, contactsTags, scope, rootScope, api, modal, gettextCatalog, q;
    beforeEach(() => {
        angular.mock.module(remove);
        inject(($controller, $rootScope, _api_, _contactsTags_, _modal_, _gettextCatalog_, $q) => {
            rootScope = $rootScope.$new();
            scope = rootScope.$new();
            api = _api_;
            contactsTags = _contactsTags_;
            gettextCatalog = _gettextCatalog_;
            modal = _modal_;
            q = $q;
            api.account_list_id = 1234;
            contactsTags.data = [{ name: 'b' }, { name: 'c' }];
            scope.$hide = () => {};
            $ctrl = $controller('removeTagController as $ctrl', {
                $scope: scope,
                selectedContacts: [{ id: 1, tag_list: ['b'] }, { id: 2, tag_list: ['a'] }],
                currentListSize: 25
            });
        });
    });

    describe('removeTag', () => {
        beforeEach(() => {
            spyOn($ctrl, 'untagContact').and.callFake(() => q.resolve());
            spyOn(scope, '$hide').and.callThrough();
            spyOn($ctrl.$rootScope, '$emit').and.callThrough();
        });

        it('should remove a tag from selected contacts', () => {
            $ctrl.removeTag('a');
            expect($ctrl.untagContact).toHaveBeenCalledWith([1, 2], 'a');
        });

        it('should call event contactCreated', (done) => {
            $ctrl.removeTag('a').then(() => {
                expect($ctrl.$rootScope.$emit).toHaveBeenCalledWith('contactCreated');
                done();
            });
            rootScope.$digest();
        });

        it('should hide the modal', (done) => {
            $ctrl.removeTag('a').then(() => {
                expect(scope.$hide).toHaveBeenCalled();
                done();
            });
            rootScope.$digest();
        });
    });

    describe('getTagsFromSelectedContacts', () => {
        it('should show a sorted list of tags', () => {
            expect($ctrl.getTagsFromSelectedContacts()).toEqual(['a', 'b']);
        });

        it('should show a complete list of tags if selected > data', () => {
            $ctrl.currentListSize = 1;
            expect($ctrl.getTagsFromSelectedContacts()).toEqual(['b', 'c']);
        });
    });

    describe('untagContact', () => {
        beforeEach(() => {
            spyOn(modal, 'confirm').and.callFake(() => q.resolve({}));
            spyOn(api, 'delete').and.callFake(() => q.resolve());
            spyOn(gettextCatalog, 'getString').and.callThrough();
            spyOn($ctrl.$rootScope, '$emit').and.callThrough();
        });

        it('should confirm a translated message', () => {
            $ctrl.untagContact([]);
            expect(gettextCatalog.getString).toHaveBeenCalledWith(jasmine.any(String));
            expect(modal.confirm).toHaveBeenCalledWith(jasmine.any(String));
        });

        it('should remove a tag', (done) => {
            $ctrl.untagContact([], 'a').then(() => {
                expect(api.delete).toHaveBeenCalledWith({
                    url: 'contacts/tags/bulk',
                    data: {
                        data: [{
                            data: {
                                type: 'tags',
                                attributes: {
                                    name: 'a'
                                }
                            }
                        }],
                        filter: {
                            account_list_id: 1234,
                            contact_ids: null
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

        it('should remove a tag from specific contacts', (done) => {
            $ctrl.untagContact([1, 2], 'a').then(() => {
                expect(api.delete).toHaveBeenCalledWith({
                    url: 'contacts/tags/bulk',
                    data: {
                        data: [{
                            data: {
                                type: 'tags',
                                attributes: {
                                    name: 'a'
                                }
                            }
                        }],
                        filter: {
                            account_list_id: 1234,
                            contact_ids: '1,2'
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

        it('should broadcast when complete', (done) => {
            $ctrl.untagContact([], 'a').then(() => {
                expect($ctrl.$rootScope.$emit).toHaveBeenCalledWith('contactTagDeleted', { tag: 'a', contactIds: [] });
                done();
            });
            rootScope.$digest();
        });
    });
});