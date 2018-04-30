import add from './info.controller';

describe('common.modal.info.controller', () => {
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
        return controller('infoController as $ctrl', {
            $scope: scope
        });
    }

    xit('should do something', () => {
        expect($ctrl).toEqual(1);
    });
});