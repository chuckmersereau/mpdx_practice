import component from './accountLists.component';

describe('menu.accountLists.component', () => {
    let $ctrl, rootScope, scope;

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            $ctrl = $componentController('accountLists', { $scope: scope }, {});
        });
    });

    describe('constructor', () => {
        it('should set showAllTags false', () => {
            expect($ctrl.showAllTags).toEqual(false);
        });
    });
});