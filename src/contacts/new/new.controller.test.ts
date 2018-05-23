import add from './new.controller';

describe('contacts.list.new.controller', () => {
    let $ctrl, controller, scope;

    function loadController() {
        return controller('contactNewModalController as $ctrl', {
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