import add from './editFields.controller';

describe('contacts.list.editFields.controller', () => {
    let $ctrl, controller, scope;

    function loadController() {
        return controller('editFieldsController as $ctrl', {
            $scope: scope
        });
    }

    beforeEach(() => {
        angular.mock.module(add);
        inject(($controller, $rootScope) => {
            scope = $rootScope.$new();
            controller = $controller;
            $ctrl = loadController();
        });
    });

    xit('should do something', () => {
        expect($ctrl).toEqual(1);
    });
});