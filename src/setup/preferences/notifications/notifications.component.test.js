import component from './notifications.component';

describe('setup.preferences.notifications.component', () => {
    let $ctrl, users, state, scope;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _users_, $state) => {
            scope = $rootScope.$new();
            users = _users_;
            users.currentOptions = {setup_position: {}};
            state = $state;
            $ctrl = $componentController('setupPreferencesNotifications', {$scope: scope}, {});
        });
        spyOn(state, 'go').and.callFake(() => {});
        spyOn(users, 'setOption').and.callFake(() => Promise.resolve());
    });
    describe('$onInit', () => {
        beforeEach(() => {
            $ctrl.$onInit();
        });
        it('should save user option for navigation', () => {
            expect($ctrl.users.currentOptions.setup_position.value).toEqual('preferences.notifications');
            expect(users.setOption).toHaveBeenCalledWith($ctrl.users.currentOptions.setup_position);
        });
    });
    describe('onSave', () => {
        beforeEach(() => {
            spyOn($ctrl, 'next');
        });
        it('should call next()', () => {
            $ctrl.onSave();
            expect($ctrl.next).toHaveBeenCalled();
        });
    });
    describe('next', () => {
        beforeEach(() => {
            $ctrl.$onInit();
        });
        it('should navigate to finish when on the last tab', (done) => {
            $ctrl.next().then(() => {
                expect(state.go).toHaveBeenCalledWith('setup.preferences.integrations');
                done();
            });
            expect($ctrl.users.currentOptions.setup_position.value).toEqual('preferences.integrations');
            expect(users.setOption).toHaveBeenCalledWith($ctrl.users.currentOptions.setup_position);
        });
    });
});