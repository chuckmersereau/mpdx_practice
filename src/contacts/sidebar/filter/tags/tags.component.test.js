import component from './tags.component';

describe('contacts.filter.tags.component', () => {
    let rootScope, scope, componentController, contactsTags, $ctrl;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _contactsTags_) => {
            rootScope = $rootScope;
            scope = $rootScope.$new();
            contactsTags = _contactsTags_;
            componentController = $componentController;
            loadController();
        });
    });
    function loadController() {
        $ctrl = componentController('contactsTags', {$scope: scope}, {});
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

    });
});