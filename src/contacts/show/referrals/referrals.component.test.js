import component from './referrals.component';

describe('contacts.show.referrals.component', () => {
    let $ctrl, scope, componentController, state, stateParams, contacts;

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, $state, $stateParams, _contacts_) => {
            scope = $rootScope.$new();
            componentController = $componentController;
            contacts = _contacts_;
            state = $state;
            stateParams = $stateParams;
            loadController();
        });
    });

    function loadController() {
        $ctrl = componentController('contactReferrals', { $scope: scope }, {});
    }

    describe('$onInit', () => {
        it('should get referrals', (done) => {
            const data = 'a';
            contacts.current = { id: 1 };
            spyOn(contacts, 'getReferrals').and.callFake(() => Promise.resolve(data));
            $ctrl.$onInit().then(() => {
                expect($ctrl.referrals).toEqual(data);
                done();
            });
            expect(contacts.getReferrals).toHaveBeenCalledWith(1);
        });
    });
    describe('openAddReferralsModal', () => {
        beforeEach(() => {
            spyOn(contacts, 'openAddReferralsModal').and.callFake(() => Promise.resolve());
        });

        it('should call contacts.openAddReferralsModal', () => {
            $ctrl.openAddReferralsModal();
            expect(contacts.openAddReferralsModal).toHaveBeenCalled();
        });

        it('should return a promise', () => {
            expect($ctrl.openAddReferralsModal()).toEqual(jasmine.any(Promise));
        });

        describe('promise successful', () => {
            it('should call $state.go', (done) => {
                spyOn(state, 'go').and.returnValue();
                stateParams.contactId = '123';
                $ctrl.openAddReferralsModal().then(() => {
                    expect(state.go).toHaveBeenCalledWith('contacts', { filters: { referrer: '123' } });
                    done();
                });
            });
        });
    });
});
