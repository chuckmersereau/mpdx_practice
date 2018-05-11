import component from './search.component';

describe('tasks.search.component', () => {
    let $ctrl, rootScope, scope;

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            $ctrl = $componentController('tasksSearch', { $scope: scope }, {});
        });
    });

    xit('should do something', () => {
        expect($ctrl).toEqual(1);
    });
});