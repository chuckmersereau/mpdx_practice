import component from './coaches.component';

describe('coaches', () => {
    let $ctrl, rootScope, scope;

    beforeEach(() => {
        angular.mock.module(component);

        inject(($componentController, $rootScope) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            $ctrl = $componentController('coaches', { $scope: scope });
        });
    });

    xit('should do something', () => {
        expect($ctrl).toEqual(1);
    });
});