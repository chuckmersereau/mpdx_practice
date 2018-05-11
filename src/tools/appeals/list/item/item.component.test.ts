import component from './item.component';

describe('tools.appeals.list.component', () => {
    let $ctrl, scope;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope) => {
            scope = $rootScope.$new();
            $ctrl = $componentController('appealsListItem', { $scope: scope }, {});
        });
    });

    describe('constructor', () => {
        it('should set public properties', () => {
            expect($ctrl.accounts).toBeDefined();
            expect($ctrl.appeals).toBeDefined();
        });
    });
});
