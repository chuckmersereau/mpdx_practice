import component from './notifications.component';

describe('contacts.list.component', () => {
    let $ctrl, accounts, serverConstants, scope, componentController;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _accounts_, _serverConstants_) => {
            scope = $rootScope.$new();
            accounts = _accounts_;
            serverConstants = _serverConstants_;
            componentController = $componentController;
            loadController();
        });
    });
    function loadController() {
        $ctrl = componentController('preferencesNotifications', {$scope: scope}, {onSave: null, setup: null});
    }
    describe('init', () => {
        it('should transform the users notification preferences with server constants', () => {
            serverConstants.data = {
                notification_translated_hashes: [{
                    id: "Partner gave a Special Gift",
                    key: "11a42c09-2ed1-4754-9b43-2d14a2a3b420",
                    value: "Partner gave a Special Gift"
                }]
            };
            accounts.current = {notification_preferences: [{id: '1234', notification_type: {id: '11a42c09-2ed1-4754-9b43-2d14a2a3b420'}, actions: ['email', 'task']}]};
            $ctrl.init();
            expect($ctrl.notifications).toEqual([{
                id: '1234',
                key: '11a42c09-2ed1-4754-9b43-2d14a2a3b420',
                title: 'Partner gave a Special Gift',
                email: true,
                task: true
            }]);
        });
    });
});