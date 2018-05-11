import add from './info.controller';

describe('common.modal.info.controller', () => {
    let $ctrl, controller, scope;

    function loadController() {
        return controller('infoController as $ctrl', {
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