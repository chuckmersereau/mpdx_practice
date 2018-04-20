import component from './tags.component';

describe('contacts.filter.tags.component', () => {
    let rootScope, scope, componentController, contactsTags, $ctrl, api;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _contactsTags_, _api_) => {
            rootScope = $rootScope;
            scope = $rootScope.$new();
            api = _api_;
            contactsTags = _contactsTags_;
            componentController = $componentController;
            loadController();
        });
    });

    function loadController() {
        $ctrl = componentController('contactsTags', { $scope: scope }, {});
    }
    describe('events', () => {
        it('should handle account list change', () => {
            spyOn(contactsTags, 'load').and.callFake(() => {});
            $ctrl.$onInit();
            rootScope.$emit('accountListUpdated');
            rootScope.$digest();
            expect(contactsTags.load).toHaveBeenCalled();
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
            spyOn(api, 'delete').and.callFake(() => Promise.resolve());
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