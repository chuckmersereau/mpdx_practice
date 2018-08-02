import component from './referrals.component';

describe('contacts.show.referrals.component', () => {
    let $ctrl, scope, contacts, q, api;

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _contacts_, $q, _api_) => {
            scope = $rootScope.$new();
            contacts = _contacts_;
            q = $q;
            api = _api_;
            $ctrl = $componentController('contactReferrals', { $scope: scope }, {});
        });
    });

    describe('$onInit', () => {
        it('should get referrals', () => {
            const data = 'a';
            contacts.current = { id: 1 };
            spyOn($ctrl, 'getReferrals').and.callFake(() => q.resolve(data));
            $ctrl.$onInit();
            expect($ctrl.getReferrals).toHaveBeenCalledWith(1);
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

    describe('getReferrals', () => {
        beforeEach(() => {
            spyOn(api, 'get').and.returnValue(q.resolve('b'));
            spyOn($ctrl, 'deserialize').and.returnValue(['a']);
        });

        it('should call the api', () => {
            $ctrl.getReferrals(1);
            expect(api.get).toHaveBeenCalledWith({
                url: 'contacts/1',
                data: {
                    include: 'contacts_referred_by_me',
                    fields: {
                        contacts: 'contacts_referred_by_me,name,created_at'
                    }
                },
                doDeSerialization: false
            });
        });

        it('should deserialize the results', (done) => {
            $ctrl.getReferrals(1).then(() => {
                expect($ctrl.deserialize).toHaveBeenCalledWith('b');
                expect($ctrl.referrals).toEqual(['a']);
                done();
            });
            scope.$digest();
        });
    });

    describe('deserialize', () => {
        it('should deserialize a jsonapi packet', () => {
            expect($ctrl.deserialize({
                data: {
                    relationships: {
                        contacts_referred_by_me: {
                            data: [
                                { id: 1 },
                                { id: 2 }
                            ]
                        }
                    }
                },
                included: [
                    { id: 1, attributes: { name: 'a', created_at: '1-1-2000' } },
                    { id: 2, attributes: { name: 'b', created_at: '1-2-2000' } }
                ]
            })).toEqual([
                { name: 'a', created_at: '1-1-2000', id: 1 },
                { name: 'b', created_at: '1-2-2000', id: 2 }
            ]);
        });
    });
});
