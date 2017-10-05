import add from './add.controller';

describe('contacts.sidebar.tags.add.controller', () => {
    let $ctrl, controller, scope, api, rootScope, contactsTags;
    beforeEach(() => {
        angular.mock.module(add);
        inject(($controller, $rootScope, _api_, _contactsTags_) => {
            rootScope = $rootScope;
            scope = $rootScope.$new();
            scope.$hide = () => {};
            api = _api_;
            api.account_list_id = 123;
            contactsTags = _contactsTags_;
            controller = $controller;
            $ctrl = loadController();
        });
    });

    function loadController() {
        return controller('addTagController as $ctrl', {
            $scope: scope,
            selectedContacts: []
        });
    }

    describe('save', () => {
        it('should save a custom tag', (done) => {
            $ctrl.tags = [];
            spyOn(api, 'post').and.callFake(() => Promise.resolve());
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
                        }
                    },
                    doSerialization: false
                });
                done();
            });
        });
        it('should add tag', (done) => {
            $ctrl.tags = [];
            spyOn(api, 'post').and.callFake(() => Promise.resolve());
            spyOn(rootScope, '$emit').and.callFake(() => {});
            spyOn(contactsTags, 'addTag').and.callFake(() => {});
            $ctrl.save('a').then(() => {
                expect(rootScope.$emit).toHaveBeenCalledWith('contactTagsAdded', { tags: ['a'], contactIds: [] });
                expect(contactsTags.addTag).toHaveBeenCalledWith({ tags: ['a'], contactIds: [] });
                done();
            });
        });
        it('should hide', (done) => {
            $ctrl.tags = [];
            spyOn(api, 'post').and.callFake(() => Promise.resolve());
            spyOn(rootScope, '$emit').and.callFake(() => {});
            spyOn(contactsTags, 'addTag').and.callFake(() => {});
            spyOn(scope, '$hide').and.callFake(() => {});
            $ctrl.save('a').then(() => {
                expect(scope.$hide).toHaveBeenCalledWith();
                done();
            });
        });
    });
});