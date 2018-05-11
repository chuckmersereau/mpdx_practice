import component from './tasks.service';

describe('tasks.component', () => {
    let $ctrl, rootScope, scope;

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            $ctrl = $componentController('tasks', { $scope: scope }, {});
        });
    });

    xit('should do something', () => {
        expect($ctrl).toEqual(1);
    });
});