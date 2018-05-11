import component from './twitter.component';

describe('common.links.twitter.component', () => {
    let $ctrl, componentController, scope, rootScope;

    function loadController() {
        $ctrl = componentController('twitterLink', { $scope: scope });
    }

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope) => {
            componentController = $componentController;
            rootScope = $rootScope;
            scope = rootScope.$new();
            loadController();
        });
    });

    xit('should do something', () => {
        expect($ctrl).toEqual(1);
    });
});
