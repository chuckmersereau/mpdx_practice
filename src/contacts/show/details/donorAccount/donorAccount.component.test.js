import component from './donorAccount.component';

describe('contacts.show.details.donorAccount.component', () => {
    let $ctrl, rootScope, scope, componentController, alerts;

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _alerts_) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            alerts = _alerts_;
            componentController = $componentController;
            loadController();
        });
        spyOn($ctrl, 'gettext').and.callFake(() => 'a');
        spyOn(alerts, 'addAlert').and.callFake((data) => data);
    });

    function loadController() {
        $ctrl = componentController('contactDonorAccount', { $scope: scope }, {});
    }

    describe('save', () => {
        it('should throw an error when current account is not present', () => {
            $ctrl.save();
            expect($ctrl.gettext).toHaveBeenCalledWith('A serious error has occurred. Please refresh your browser or try logging out.');
            expect(alerts.addAlert).toHaveBeenCalledWith('a', 'danger');
        });
    });
});