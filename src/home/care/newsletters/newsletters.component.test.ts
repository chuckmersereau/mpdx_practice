import component from './newsletters.component';

describe('home.care.newsletters', () => {
    let $ctrl, rootScope, scope;

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            $ctrl = $componentController('newsletters', { $scope: scope }, {});
        });
    });

    describe('constructor', () => {
        it('should define view objects', () => {
            expect($ctrl.tasks).toBeDefined();
        });
    });
});