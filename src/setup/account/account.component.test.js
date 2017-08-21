import component from './account.component';

describe('setup.account.component', () => {
    let $ctrl, rootScope, scope, componentController, users;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _users_) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            componentController = $componentController;
            users = _users_;
            users.current = { preferences: {} };
            users.currentOptions = { setup_position: {} };
            loadController();
        });
    });
    function loadController() {
        $ctrl = componentController('setupAccount', { $scope: scope }, {});
    }
    describe('$onInit', () => {
        it('should call listOrganizationAccounts', () => {
            spyOn(users, 'listOrganizationAccounts').and.callFake(() => Promise.resolve());
            $ctrl.$onInit();
            expect(users.listOrganizationAccounts).toHaveBeenCalled();
        });
        describe('accountListUpdated event', () => {
            it('should call listOrganizationAccounts when event accountListUpdated triggered', () => {
                $ctrl.$onInit();
                spyOn(users, 'listOrganizationAccounts').and.callFake(() => Promise.resolve());
                rootScope.$emit('accountListUpdated');
                expect(users.listOrganizationAccounts).toHaveBeenCalledWith(true);
            });
        });
    });
});