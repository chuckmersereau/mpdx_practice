import component from './search.component';

describe('menu.search.component', () => {
    let $ctrl, state, scope, contactFilter;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, $state, _contactFilter_) => {
            scope = $rootScope.$new();
            contactFilter = _contactFilter_;
            state = $state;
            $ctrl = $componentController('menuSearch', {$scope: scope}, {});
        });
        spyOn(state, 'go').and.callFake(() => {});
    });
    describe('gotoList', () => {
        beforeEach(() => {
            spyOn($ctrl, 'reset').and.callFake(() => {});
        });
        it('should change the wildcard search value for contact filters', () => {
            $ctrl.searchParams = 'abc';
            $ctrl.gotoList();
            expect(contactFilter.wildcard_search).toEqual('abc');
        });
        it('should navigate to the contact list', () => {
            $ctrl.gotoList();
            expect(state.go).toHaveBeenCalledWith('contacts', {}, {reload: true});
        });
        it('should clear out the value after navigation', () => {
            $ctrl.gotoList();
            expect($ctrl.reset).toHaveBeenCalled();
        });
    });
});