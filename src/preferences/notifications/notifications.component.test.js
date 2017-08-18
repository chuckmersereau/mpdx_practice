import component from './notifications.component';

describe('contacts.list.component', () => {
    let $ctrl, accounts, serverConstants, scope, componentController, alerts, gettextCatalog;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _accounts_, _serverConstants_, _alerts_, _gettextCatalog_) => {
            scope = $rootScope.$new();
            accounts = _accounts_;
            alerts = _alerts_;
            gettextCatalog = _gettextCatalog_;
            serverConstants = _serverConstants_;
            componentController = $componentController;
            loadController();
        });
        spyOn(alerts, 'addAlert').and.callFake(data => data);
        spyOn(gettextCatalog, 'getString').and.callThrough();
    });
    function loadController() {
        $ctrl = componentController('preferencesNotifications', { $scope: scope }, { onSave: () => Promise.resolve(), setup: null });
    }
    describe('init', () => {
        it('should transform the users notification preferences with server constants', () => {
            serverConstants.data = {
                notification_translated_hashes: [{
                    id: 'Partner gave a Special Gift',
                    key: '11a42c09-2ed1-4754-9b43-2d14a2a3b420',
                    value: 'Partner gave a Special Gift'
                }]
            };
            accounts.current = { notification_preferences: [{ id: '1234', notification_type: { id: '11a42c09-2ed1-4754-9b43-2d14a2a3b420' }, actions: ['email', 'task'] }] };
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
    describe('save', () => {
        beforeEach(() => {
            accounts.current = { id: 1 };
        });
        it('should set saving flag', () => {
            spyOn(accounts, 'saveCurrent').and.callFake(() => Promise.resolve());
            $ctrl.save();
            expect($ctrl.saving).toBeTruthy();
        });
        it('should save', () => {
            spyOn(accounts, 'saveCurrent').and.callFake(() => Promise.resolve());
            $ctrl.save();
            expect(accounts.saveCurrent).toHaveBeenCalledWith();
        });
        it('should alert a translated confirmation', done => {
            spyOn(accounts, 'saveCurrent').and.callFake(() => Promise.resolve());
            $ctrl.save().then(() => {
                expect(alerts.addAlert).toHaveBeenCalledWith(jasmine.any(String), 'success');
                expect(gettextCatalog.getString).toHaveBeenCalledWith(jasmine.any(String));
                done();
            });
        });
        it('should call onSave', done => {
            spyOn(accounts, 'saveCurrent').and.callFake(() => Promise.resolve());
            spyOn($ctrl, 'onSave').and.callFake(() => Promise.resolve());
            $ctrl.save().then(() => {
                expect($ctrl.onSave).toHaveBeenCalled();
                done();
            });
        });
        it('should unset saving flag', done => {
            spyOn(accounts, 'saveCurrent').and.callFake(() => Promise.resolve());
            $ctrl.save().then(() => {
                expect($ctrl.saving).toBeFalsy();
                done();
            });
        });
    });
});