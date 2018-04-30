import component from './tools.component';

describe('tools.component', () => {
    let $ctrl, componentController, scope, rootScope, help, tools;

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, $stateParams, _help_, _tools_) => {
            componentController = $componentController;
            rootScope = $rootScope;
            scope = rootScope.$new();
            help = _help_;
            tools = _tools_;
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
            expect($ctrl.dropdown).toBeFalsy();
        });
    });

    describe('$onInit', () => {
        beforeEach(() => {
            spyOn(tools, 'getAnalytics').and.callFake(() => {});
        });

        it('should call help service', () => {
            spyOn(help, 'suggest').and.callFake(() => {});
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

        it('should have called tools.getAnalytics', () => {
            $ctrl.$onInit();
            expect(tools.getAnalytics).toHaveBeenCalled();
        });

        it('should refresh tools.getAnalytics on account swap', () => {
            $ctrl.$onInit();
            rootScope.$emit('accountListUpdated');
            rootScope.$digest();
            expect(tools.getAnalytics).toHaveBeenCalledWith(true);
        });
    });

    describe('$onDestroy', () => {
        it('should set session.navSecondary', () => {
            $ctrl.$onDestroy();
            expect($ctrl.session.navSecondary).toBeFalsy();
        });
    });
});
