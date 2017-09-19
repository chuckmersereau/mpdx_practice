import edit from './edit.controller';

describe('tools.appeals.show.editCommitment.controller', () => {
    let $ctrl, controller, api, scope;
    beforeEach(() => {
        angular.mock.module(edit);
        inject(($controller, $rootScope, _api_) => {
            scope = $rootScope.$new();
            api = _api_;
            api.account_list_id = 321;
            controller = $controller;
            $ctrl = loadController();
        });
    });

    function loadController() {
        return controller('editCommitmentController as $ctrl', {
            $scope: scope,
            appealId: 123,
            pledge: {}
        });
    }
    describe('contactSearch', () => {
        it('should query the api', () => {
            $ctrl.appealId = 1;
            spyOn(api, 'get').and.callFake(() => Promise.resolve());
            $ctrl.contactSearch('a');
            expect(api.get).toHaveBeenCalledWith({
                url: 'contacts',
                data: {
                    filter: {
                        appeal: 1,
                        account_list_id: api.account_list_id,
                        wildcard_search: 'a'
                    },
                    fields: {
                        contacts: 'name'
                    },
                    per_page: 6,
                    sort: 'name'
                },
                overrideGetAsPost: true
            });
        });
    });
    describe('onContactSelected', () => {
        it('should set the contact id', () => {
            $ctrl.onContactSelected({ id: 1 });
            expect($ctrl.pledge.contactId).toEqual(1);
        });
        it('should set the contact name for display', () => {
            $ctrl.onContactSelected({ id: 1, name: 'a' });
            expect($ctrl.selectedContact).toEqual('a');
        });
    });
    describe('save', () => {
        beforeEach(() => {
            spyOn(api, 'put').and.callFake(() => Promise.resolve({}));
            scope.$hide = () => {};
            spyOn(scope, '$hide').and.callFake(() => {});
        });
        it('should create a task', () => {
            $ctrl.pledge = {
                id: 1,
                amount: 150,
                commitmentCurrency: 'USD',
                expectedDate: '2007-01-01',
                contactId: 3
            };
            $ctrl.appealId = 2;
            $ctrl.save();
            expect(api.put).toHaveBeenCalledWith('account_lists/321/pledges/1', {
                amount: 150,
                amount_currency: 'USD',
                expected_date: '2007-01-01',
                appeal: {
                    id: 2
                },
                contact: {
                    id: 3
                }
            });
        });
        it('should hide the modal when finished', (done) => {
            $ctrl.save().then(() => {
                expect(scope.$hide).toHaveBeenCalled();
                done();
            });
        });
    });
});