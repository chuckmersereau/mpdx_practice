import component from './home.component';

describe('home.component', () => {
    let $ctrl, rootScope, scope;

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            $ctrl = $componentController('home', { $scope: scope }, {});
        });
    });

    xit('should do something', () => {
        expect($ctrl).toEqual(1);
    });
});