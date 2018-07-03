import add from './add.controller';

describe('contacts.show.referrals.add.controller', () => {
    let $ctrl, scope, state, stateParams, contacts, q;
    beforeEach(() => {
        angular.mock.module(add);
        inject(($controller, $rootScope, $state, $stateParams, _contacts_, $q) => {
            scope = $rootScope.$new();
            scope.$hide = () => {};
            contacts = _contacts_;
            q = $q;
            state = $state;
            stateParams = $stateParams;
            $ctrl = $controller('addReferralsModalController as $ctrl', {
                $scope: scope,
                contact: {}
            });
        });
    });

    xit('should do something', () => {
        expect($ctrl).toEqual(1);
    });

    describe('save', () => {
        it('should call $state.go', (done) => {
            spyOn(state, 'go').and.returnValue('');
            spyOn(contacts, 'addReferrals').and.returnValue(q.resolve());
            stateParams.contactId = '123';
            $ctrl.models = [{
                first_name: 'a'
            }];
            $ctrl.save().then(() => {
                expect(state.go).toHaveBeenCalledWith('contacts', { filters: { referrer: '123' } });
                done();
            });
            scope.$digest();
        });
    })
});