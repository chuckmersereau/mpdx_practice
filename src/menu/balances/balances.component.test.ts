import component from './balances.component';

describe('menu.balances.component', () => {
    let $ctrl, componentController, scope, rootScope, designationAccounts, api, accounts, gettextCatalog, q;

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _accounts_, _designationAccounts_, _api_, _gettextCatalog_, $q) => {
            componentController = $componentController;
            rootScope = $rootScope;
            scope = rootScope.$new();
            accounts = _accounts_;
            api = _api_;
            q = $q;
            api.account_list_id = 123;
            designationAccounts = _designationAccounts_;
            gettextCatalog = _gettextCatalog_;
            loadController();
        });
    });

    function loadController() {
        $ctrl = componentController('menuBalances', { $scope: scope });
    }
    describe('$onInit', () => {
        beforeEach(() => {
            spyOn($ctrl, 'init').and.callFake(() => q.resolve());
        });
        it('should call init', () => {
            $ctrl.$onInit();
            expect($ctrl.init).toHaveBeenCalledWith();
        });
        it('should call init on accountListUpdated', () => {
            $ctrl.$onInit();
            rootScope.$emit('accountListUpdated');
            rootScope.$digest();
            expect($ctrl.init).toHaveBeenCalledWith();
        });
    });
    describe('init', () => {
        beforeEach(() => {
            spyOn($ctrl, 'getDesignationAccounts').and.callFake(() => q.resolve());
            spyOn($ctrl, 'getGoals').and.callFake(() => q.resolve());
        });
        it('should get designationAccounts', () => {
            $ctrl.init();
            expect($ctrl.getDesignationAccounts).toHaveBeenCalledWith();
        });
        it('should get goals', () => {
            $ctrl.init();
            expect($ctrl.getGoals).toHaveBeenCalledWith();
        });
    });
    describe('getDesignationAccounts', () => {
        beforeEach(() => {
            spyOn(designationAccounts, 'load').and.callFake(() => q.resolve());
        });
        it('should load fresh designationAccounts', () => {
            $ctrl.getDesignationAccounts();
            expect(designationAccounts.load).toHaveBeenCalledWith(true);
        });
        it('should get balance', (done) => {
            designationAccounts.data = [
                { active: true, converted_balance: 5 },
                { active: true, converted_balance: 5 }
            ];
            $ctrl.getDesignationAccounts().then(() => {
                expect($ctrl.balance).toEqual(10);
                done();
            });
            scope.$digest();
        });
        it('should handle inactive', (done) => {
            designationAccounts.data = [
                { active: false, converted_balance: 5 },
                { active: true, converted_balance: 5 }
            ];
            $ctrl.getDesignationAccounts().then(() => {
                expect($ctrl.balance).toEqual(5);
                done();
            });
            scope.$digest();
        });
    });
    describe('getGoals', () => {
        const goals = {
            received_pledges: 10
        };
        beforeEach(() => {
            spyOn(api, 'get').and.callFake(() => q.resolve(goals));
            accounts.current = {
                total_pledges: 5,
                monthly_goal: 25
            };
        });
        it('should load fresh designationAccounts', () => {
            $ctrl.getGoals();
            expect(api.get).toHaveBeenCalledWith('reports/goal_progress', {
                filter: {
                    account_list_id: 123
                }
            });
        });
        it('should set goals', (done) => {
            $ctrl.getGoals().then(() => {
                expect($ctrl.goals).toEqual(goals);
                done();
            });
            scope.$digest();
        });
        it('should set title', (done) => {
            spyOn(gettextCatalog, 'getString').and.callFake(() => 'a');
            $ctrl.getGoals().then(() => {
                expect(gettextCatalog.getString).toHaveBeenCalledWith(
                    '{{received}} received/{{pledged}} committed of goal: {{goal}}. Click to see outstanding financial partners.',
                    { pledged: 5, received: 10, goal: 25 }
                );
                expect($ctrl.title).toEqual('a');
                done();
            });
            scope.$digest();
        });
    });
});