import component from './twitter.component';

describe('contacts.show.personModal.twitter.component', () => {
    let $ctrl, rootScope, scope, componentController;

    function loadController() {
        $ctrl = componentController('peopleTwitter', { $scope: scope }, {});
    }

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            componentController = $componentController;
            loadController();
        });
    });

    xit('should do something', () => {
        expect($ctrl).toEqual(1);
    });
});