import component from './facebook.component';

describe('contacts.show.personModal.facebook.component', () => {
    let $ctrl, rootScope, scope, componentController;

    function loadController() {
        $ctrl = componentController('peopleFacebook', { $scope: scope }, {});
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