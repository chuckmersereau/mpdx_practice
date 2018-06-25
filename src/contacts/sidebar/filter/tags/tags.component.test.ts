import component from './tags.component';

describe('contacts.filter.tags.component', () => {
    let rootScope, scope, contactsTags, $ctrl, api, q, users;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _contactsTags_, _api_, $q, _users_) => {
            rootScope = $rootScope;
            scope = $rootScope.$new();
            api = _api_;
            contactsTags = _contactsTags_;
            q = $q;
            users = _users_;
            $ctrl = $componentController('contactsTags', { $scope: scope }, {});
        });
    });

    describe('constructor', () => {
        it('should define default values', () => {
            expect($ctrl.hideTags).toEqual(true);
        });
    });

    describe('$onInit', () => {
        beforeEach(() => {
            spyOn(users, 'getCurrentOptionValue').and.callFake(() => true);
            spyOn(users, 'saveOption').and.callFake(() => q.resolve());
            spyOn(contactsTags, 'load').and.callFake(() => {});
        });

        afterEach(() => {
            $ctrl.$onDestroy();
        });

        it('should set isCollapsed', () => {
            $ctrl.$onInit();
            expect($ctrl.isCollapsed).toBeTruthy();
        });

        it('should handle isCollapsed changing', () => {
            $ctrl.$onInit();
            $ctrl.isCollapsed = false;
            rootScope.$digest();
            expect(users.saveOption).toHaveBeenCalledWith('contact_tags_collapse', false);
        });

        it('should handle account list change', () => {
            $ctrl.$onInit();
            rootScope.$emit('accountListUpdated');
            rootScope.$digest();
            expect(contactsTags.load).toHaveBeenCalled();
        });
    });

    describe('$onDestroy', () => {
        it('should clear watchers', () => {
            $ctrl.$onInit();
            spyOn($ctrl, 'watcher').and.callFake(() => {});
            spyOn($ctrl, 'watcher2').and.callFake(() => {});
            $ctrl.$onDestroy();
            expect($ctrl.watcher).toHaveBeenCalledWith();
            expect($ctrl.watcher2).toHaveBeenCalledWith();
        });
    });

    describe('changeAny', () => {
        it('should change contactsTags.anyTags', () => {
            $ctrl.changeAny(true);
            expect(contactsTags.anyTags).toBeTruthy();
            $ctrl.changeAny(false);
            expect(contactsTags.anyTags).toBeFalsy();
        });
    });

    describe('delete', () => {
        const tag = { name: 'a' };
        beforeEach(() => {
            spyOn(api, 'delete').and.callFake(() => q.resolve());
        });

        it('should call api', () => {
            $ctrl.delete(tag);
            expect(api.delete).toHaveBeenCalledWith({
                url: 'contacts/tags/bulk',
                params: {
                    filter: {
                        account_list_id: api.account_list_id
                    }
                },
                data: [{
                    name: tag.name
                }],
                type: 'tags',
                fields: {
                    contacts: ''
                }
            });
        });
    });
});
