import component from './reports.component';

describe('reports.component', () => {
    let $ctrl, componentController, scope, rootScope, help;

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, $stateParams, _help_) => {
            componentController = $componentController;
            rootScope = $rootScope;
            scope = rootScope.$new();
            help = _help_;
            loadController();
        });
    });

    function loadController() {
        $ctrl = componentController('reports', { $scope: scope });
    }

    describe('$onInit', () => {
        it('should call help service', () => {
            spyOn(help, 'suggest').and.returnValue();
            $ctrl.$onInit();
            expect(help.suggest).toHaveBeenCalledWith([
                '584820bc9033600698177a95',
                '58496cc0c6979106d373bb52',
                '58496f15c6979106d373bb65',
                '58481f069033600698177a78',
                '58481e189033600698177a69',
                '5845ac509033600698176a62',
                '58496d4ec6979106d373bb57',
                '58496e389033600698178180'
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
