import component from './tools.component';

describe('tools.component', () => {
    let $ctrl, componentController, scope, rootScope, help;

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, $stateParams, _help_) => {
            componentController = $componentController;
            rootScope = $rootScope;
            scope = rootScope.$new();
            help = _help_;
            $stateParams.setup = true;
            loadController();
        });
    });

    function loadController() {
        $ctrl = componentController('tools', { $scope: scope });
    }

    describe('constructor', () => {
        it('should set default values', () => {
            expect($ctrl.setup).toBeTruthy();
        });
    });

    describe('$onInit', () => {
        it('should call help service', () => {
            spyOn(help, 'suggest').and.returnValue();
            $ctrl.$onInit();
            expect(help.suggest).toHaveBeenCalledWith([
                '5845aa229033600698176a54',
                '584715b890336006981774d2',
                '5845a6de9033600698176a43',
                '58496d4ec6979106d373bb57',
                '58496e389033600698178180',
                '58a47007dd8c8e56bfa7b7a4'
            ]);
        });

        it('should set session.navSecondary', () => {
            $ctrl.$onInit();
            expect($ctrl.session.navSecondary).toBeTruthy();
        });
    });

    describe('$onDestroy', () => {
        it('should set session.navSecondary', () => {
            $ctrl.$onDestroy();
            expect($ctrl.session.navSecondary).toBeFalsy();
        });
    });
});
