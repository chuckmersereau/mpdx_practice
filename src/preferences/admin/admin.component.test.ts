import component from './admin.component';

describe('preferences.admin.component', () => {
    let $ctrl, scope, rootScope;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            $ctrl = $componentController('preferencesAdmin', { $scope: scope }, {});
        });
    });

    describe('constructor', () => {
        it('should set default values', () => {
            expect($ctrl.tabId).toEqual('impersonate_user');
        });
    });

    describe('setTab', () => {
        describe('tabId is tab being selected', () => {
            it('should set tabId to empty string', () => {
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
