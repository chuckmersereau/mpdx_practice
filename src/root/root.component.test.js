import component from './root.component';

describe('root.component', () => {
    let $ctrl, componentController, scope, rootScope, session;

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _session_) => {
            componentController = $componentController;
            rootScope = $rootScope;
            scope = rootScope.$new();
            session = _session_;
            loadController();
        });
    });

    function loadController() {
        $ctrl = componentController('root', { $scope: scope });
    }

    describe('constructor', () => {
        it('should set default values', () => {
            expect($ctrl.session).toEqual(session);
        });
    });
});
