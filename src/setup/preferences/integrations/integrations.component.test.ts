import component from './integrations.component';

const selectableTabs = ['google', 'mailchimp', 'prayerletters'];

describe('setup.preferences.integrations.component', () => {
    let $ctrl, users, state, scope, q;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _users_, $state, $q) => {
            scope = $rootScope.$new();
            users = _users_;
            users.currentOptions = { setup_position: {} };
            state = $state;
            q = $q;
            $ctrl = $componentController('setupPreferencesIntegrations', { $scope: scope }, {});
        });
        spyOn(state, 'go').and.callFake(() => {});
        spyOn(users, 'setOption').and.callFake(() => new q((resolve) => resolve({})));
    });
    describe('constructor', () => {
        it('should set selectable tabs', () => {
            expect($ctrl.selectableTabs).toEqual(selectableTabs);
        });
    });
    describe('$onInit', () => {
        beforeEach(() => {
            $ctrl.$onInit();
        });
        it('should set the initial tab', () => {
            expect($ctrl.selectedTab).toEqual($ctrl.selectableTabs[0]);
        });
        it('should save user option for navigation', () => {
            expect($ctrl.users.currentOptions.setup_position.value).toEqual('preferences.integrations');
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
        it('should set the next tab active', () => {
            $ctrl.selectedTab = $ctrl.selectableTabs[0];
            $ctrl.next();
            expect($ctrl.selectedTab).toEqual($ctrl.selectableTabs[1]);
        });
        it('should navigate to finish when on the last tab', (done) => {
            $ctrl.selectedTab = $ctrl.selectableTabs[$ctrl.selectableTabs.length - 1];
            $ctrl.next().then(() => {
                expect(state.go).toHaveBeenCalledWith('setup.finish');
                done();
            });
            scope.$digest();
            expect($ctrl.users.currentOptions.setup_position.value).toEqual('finish');
            expect(users.setOption).toHaveBeenCalledWith($ctrl.users.currentOptions.setup_position);
        });
    });
});