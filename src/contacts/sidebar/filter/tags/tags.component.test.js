import component from './tags.component';

describe('contacts.filter.tags.component', () => {
    let rootScope, scope, componentController, contactsTags;
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
        componentController('contactsTags', {$scope: scope}, {});
    }
    describe('events', () => {
        it('should handle account list change', () => {
            spyOn(contactsTags, 'load').and.callFake(() => {});
            rootScope.$emit('accountListUpdated');
            rootScope.$digest();
            expect(contactsTags.load).toHaveBeenCalled();
        });
    });
});