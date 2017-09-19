import component from './coaches.component';

describe('preferences.coaches.component', () => {
    let $ctrl, componentController, scope, stateParams, rootScope, help;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, $stateParams, _help_) => {
            stateParams = $stateParams;
            help = _help_;
            rootScope = $rootScope;
            scope = rootScope.$new();
            componentController = $componentController;
            loadController();
        });
    });

    function loadController() {
        $ctrl = componentController('preferencesCoaches', { $scope: scope }, {});
    }

    describe('constructor', () => {
        it('should set default values', () => {
            expect($ctrl.tabId).toEqual('share_coaching_account');
        });
    });

    describe('$onInit', () => {
        it('should call help.suggest', () => {
            spyOn(help, 'suggest').and.returnValue();
            $ctrl.$onInit();
            expect(help.suggest).toHaveBeenCalledWith(['57e2f280c697910d0784d307']);
        });

        describe('$stateParams.id set', () => {
            beforeEach(() => {
                stateParams.id = 'tab_id';
            });

            it('should call setTab', () => {
                spyOn($ctrl, 'setTab').and.returnValue();
                $ctrl.$onInit();
                expect($ctrl.setTab).toHaveBeenCalledWith('tab_id');
            });
        });
    });

    describe('setTab', () => {
        describe('tabId is tab being selected', () => {
            it('should set tabId to empty string', () => {
                $ctrl.tabId = 'impersonate_user';
                $ctrl.setTab('impersonate_user');
                expect($ctrl.tabId).toEqual('');
            });
        });

        describe('tabId is not tab being selected', () => {
            it('should set tabId to tab being selected', () => {
                $ctrl.setTab('offline_organization');
                expect($ctrl.tabId).toEqual('offline_organization');
            });
        });
    });
});
