import edit from './edit.controller';

describe('tools.appeals.show.editPledge.controller', () => {
    let $ctrl, controller, api, scope, rootScope;
    beforeEach(() => {
        angular.mock.module(edit);
        inject(($controller, $rootScope, _api_) => {
            rootScope = $rootScope;
            scope = $rootScope.$new();
            api = _api_;
            api.account_list_id = 321;
            controller = $controller;
            $ctrl = loadController();
        });
        spyOn($ctrl, 'gettext').and.callFake((data) => data);
    });

    function loadController() {
        return controller('editPledgeController as $ctrl', {
            $scope: scope,
            appealId: 123,
            pledge: {
                contact: {
                    name: 'a'
                }
            }
        });
    }
    describe('save', () => {
        beforeEach(() => {
            spyOn(api, 'put').and.callFake(() => Promise.resolve({}));
            scope.$hide = () => {};
            spyOn(scope, '$hide').and.callFake(() => {});
            spyOn(rootScope, '$emit').and.callFake(() => {});
        });
        it('should create a pledge', () => {
            $ctrl.pledge = {
                id: 1,
                amount: 150,
                pledgeCurrency: 'USD',
                expected_date: '2007-01-01',
                status: 'not_received',
                contactId: 3
            };
            $ctrl.appealId = 2;
            const successMessage = 'Successfully edited commitment';
            const errorMessage = 'Unable to edit commitment';

            $ctrl.save();
            expect(api.put).toHaveBeenCalledWith('account_lists/321/pledges/1', {
                id: 1,
                amount: 150,
                expected_date: '2007-01-01',
                status: 'not_received',
                appeal: {
                    id: 2
                },
                contact: {
                    id: 3
                }
            }, successMessage, errorMessage);
        });
        it('should hide the modal when finished', (done) => {
            $ctrl.save().then(() => {
                expect(scope.$hide).toHaveBeenCalled();
                done();
            });
        });
        it('should notify other components when finished', (done) => {
            $ctrl.save().then(() => {
                expect(rootScope.$emit).toHaveBeenCalledWith('pledgeAdded');
                done();
            });
        });
    });
});