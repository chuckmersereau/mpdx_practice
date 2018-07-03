import component from './referrals.component';

describe('contacts.show.referrals.component', () => {
    let $ctrl, scope, contacts, q;

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _contacts_, $q) => {
            scope = $rootScope.$new();
            contacts = _contacts_;
            q = $q;
            $ctrl = $componentController('contactReferrals', { $scope: scope }, {});
        });
    });

    describe('$onInit', () => {
        it('should get referrals', (done) => {
            const data = 'a';
            contacts.current = { id: 1 };
            spyOn(contacts, 'getReferrals').and.callFake(() => q.resolve(data));
            $ctrl.$onInit().then(() => {
                expect($ctrl.referrals).toEqual(data);
                done();
            });
            expect(contacts.getReferrals).toHaveBeenCalledWith(1);
            scope.$digest();
        });
    });

    describe('openAddReferralsModal', () => {
        beforeEach(() => {
            spyOn(contacts, 'openAddReferralsModal').and.callFake(() => q.resolve());
        });

        it('should call contacts.openAddReferralsModal', () => {
            $ctrl.openAddReferralsModal();
            expect(contacts.openAddReferralsModal).toHaveBeenCalled();
        });
    });
});
