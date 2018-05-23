import component from './facebook.component';

describe('common.links.facebook.component', () => {
    let $ctrl, componentController, scope, rootScope;

    function loadController() {
        $ctrl = componentController('facebookLink', { $scope: scope }, {
            facebookAccount: {
                username: 'a'
            }
        });
    }

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope) => {
            componentController = $componentController;
            rootScope = $rootScope;
            scope = rootScope.$new();
            loadController();
        });
    });

    it('should build a url from username', () => {
        $ctrl.$onInit();
        expect($ctrl.url).toEqual('http://www.facebook.com/a');
    });

    it('should build a url from remote id', () => {
        $ctrl.facebookAccount.username = undefined;
        $ctrl.facebookAccount.remote_id = 'b';
        $ctrl.$onInit();
        expect($ctrl.url).toEqual('http://www.facebook.com/b');
    });

    it('should handle nulls', () => {
        $ctrl.facebookAccount.username = undefined;
        $ctrl.facebookAccount.remote_id = undefined;
        $ctrl.$onInit();
        expect($ctrl.url).toEqual('http://www.facebook.com/');
    });
});
