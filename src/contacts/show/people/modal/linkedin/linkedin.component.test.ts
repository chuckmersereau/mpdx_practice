import component from './linkedin.component';

describe('contacts.show.personModal.linkedin.component', () => {
    let $ctrl, rootScope, scope, componentController;

    function loadController() {
        $ctrl = componentController('peopleLinkedin', { $scope: scope }, {});
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