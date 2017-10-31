import add from './add.controller';

describe('tools.appeals.show.addPledge.controller', () => {
    let $ctrl, controller, api, scope, rootScope, alerts;
    beforeEach(() => {
        angular.mock.module(add);
        inject(($controller, $rootScope, _api_, _alerts_) => {
            rootScope = $rootScope;
            scope = $rootScope.$new();
            alerts = _alerts_;
            api = _api_;
            api.account_list_id = 321;
            controller = $controller;
            $ctrl = loadController();
        });
        spyOn(alerts, 'addAlert').and.callFake((data) => data);
        spyOn($ctrl, 'gettext').and.callFake((data) => data);
    });

    function loadController() {
        return controller('addPledgeController as $ctrl', {
            $scope: scope,
            appealId: 123,
            contact: {
                id: 3,
                name: 'joe'
            }
        });
    }
    describe('save', () => {
        beforeEach(() => {
            spyOn(api, 'post').and.callFake(() => Promise.resolve());
            scope.$hide = () => {};
            spyOn(scope, '$hide').and.callFake(() => {});
            spyOn(rootScope, '$emit').and.callFake(() => {});
        });
        it('should create a pledge', () => {
            $ctrl.amount = 150;
            $ctrl.currency = 'USD';
            $ctrl.expected_date = '2007-01-01';
            $ctrl.appealId = 2;
            $ctrl.contactId = 3;
            $ctrl.save();
            expect(api.post).toHaveBeenCalledWith('account_lists/321/pledges', {
                amount: 150,
                expected_date: '2007-01-01',
                status: 'not_received',
                appeal: {
                    id: 2
                },
                contact: {
                    id: 3
                }
            });
        });
        it('should alert when finished', (done) => {
            $ctrl.save().then(() => {
                expect($ctrl.gettext).toHaveBeenCalledWith('Successfully added commitment to appeal');
                expect(alerts.addAlert).toHaveBeenCalledWith('Successfully added commitment to appeal');
                done();
            });
        });
        it('should hide the modal when finished', (done) => {
            $ctrl.save().then(() => {
                expect(scope.$hide).toHaveBeenCalled();
                done();
            });
        });
        it('should notify other components when finished', (done) => {
            $ctrl.save().then(() => {
                expect(rootScope.$emit).toHaveBeenCalledWith('pledgeAdded', jasmine.any(Object));
                done();
            });
        });
    });
    describe('save - failed', () => {
        beforeEach(() => {
            spyOn(api, 'post').and.callFake(() => Promise.reject());
        });
        it('should alert on reject', (done) => {
            $ctrl.save().then(() => {
                expect($ctrl.gettext).toHaveBeenCalledWith('Unable to add commitment to appeal');
                expect(alerts.addAlert).toHaveBeenCalledWith('Unable to add commitment to appeal', 'danger');
                done();
            });
        });
    });
});