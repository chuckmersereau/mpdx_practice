import component from './donorAccount.component';

describe('contacts.show.details.donorAccount.component', () => {
    let $ctrl, rootScope, scope, componentController, session;

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _session_) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            session = _session_;
            componentController = $componentController;
            loadController();
        });
        spyOn($ctrl, 'gettext').and.callFake(() => 'a');
    });

    function loadController() {
        $ctrl = componentController('contactDonorAccount', { $scope: scope }, {});
    }

    describe('save', () => {
        it('should throw an error when current account is not present', () => {
            $ctrl.save();
            expect($ctrl.gettext).toHaveBeenCalledWith('A serious error has occurred. Please refresh your browser or try logging out.');
            expect(session.errors).toEqual([{ message: 'a' }]);
        });
    });
});