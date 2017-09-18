import add from './new.controller';

describe('contacts.list.new.controller', () => {
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
        return controller('contactNewModalController as $ctrl', {
            $scope: scope
        });
    }

    xit('should do something', () => {
        expect($ctrl).toEqual(1);
    });
});