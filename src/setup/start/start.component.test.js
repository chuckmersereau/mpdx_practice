import component from './start.component';

describe('setup.start.component', () => {
    let $ctrl, componentController, scope, rootScope, setup;

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _setup_) => {
            componentController = $componentController;
            rootScope = $rootScope;
            setup = _setup_;
            scope = rootScope.$new();
            loadController();
        });
    });

    function loadController() {
        $ctrl = componentController('setupStart', { $scope: scope });
    }

    describe('$onInit', () => {
        it('should call setup.setPosition', () => {
            spyOn(setup, 'setPosition');
            $ctrl.$onInit();
            expect(setup.setPosition).toHaveBeenCalledWith('start');
        });
    });
});
