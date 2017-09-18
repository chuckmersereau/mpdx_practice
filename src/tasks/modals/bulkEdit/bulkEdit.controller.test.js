import add from './bulkEdit.controller';

describe('tasks.bulkEdit.controller', () => {
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
        return controller('bulkEditTaskController as $ctrl', {
            $scope: scope
        });
    }

    xit('should do something', () => {
        expect($ctrl).toEqual(1);
    });
});