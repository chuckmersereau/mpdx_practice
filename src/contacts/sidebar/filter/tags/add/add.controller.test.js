import add from './add.controller';

describe('contacts.sidebar.tags.add.controller', () => {
    let $ctrl, controller, scope;
    beforeEach(() => {
        angular.mock.module(add);
        inject(($controller, $rootScope) => {
            scope = $rootScope.$new();
            controller = $controller;
            $ctrl = loadController();
        });
    });

    function loadController() {
        return controller('addTagController as $ctrl', {
            $scope: scope
        });
    }

    xit('should do something', () => {
        expect($ctrl).toEqual(1);
    });
});