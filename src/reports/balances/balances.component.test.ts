import component from './balances.component';

describe('reports.balances.component', () => {
    let $ctrl, componentController, rootScope, scope, designationAccounts, q;

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _designationAccounts_, $q) => {
            componentController = $componentController;
            rootScope = $rootScope;
            q = $q;
            scope = $rootScope.$new();

            designationAccounts = _designationAccounts_;
            loadController();
        });
    });

    function loadController() {
        spyOn(rootScope, '$on').and.callThrough();
        $ctrl = componentController('balances', { $scope: scope }, { view: null });
    }

    describe('constructor', () => {
        it('should set watcher on accountListUpdated', () => {
            expect(rootScope.$on.calls.mostRecent().args[0]).toEqual('accountListUpdated');
        });

        it('should call load when event accountListUpdated triggered', () => {
            spyOn($ctrl, 'load').and.callFake(() => q.resolve());
            rootScope.$emit('accountListUpdated');
            expect($ctrl.load).toHaveBeenCalled();
        });
    });

    describe('$onInit', () => {
        beforeEach(() => {
            spyOn($ctrl, 'load').and.callFake(() => q.resolve());
        });

        it('should call load', () => {
            $ctrl.$onInit();
            expect($ctrl.load).toHaveBeenCalled();
        });
    });

    describe('load', () => {
        beforeEach(() => {
            spyOn(designationAccounts, 'load').and.callFake((reset) => q.resolve(reset));
        });

        it('should return a promise', () => {
            expect($ctrl.load()).toEqual(jasmine.any(q));
        });

        it('should set loading to true', () => {
            $ctrl.loading = false;
            $ctrl.load();
            expect($ctrl.loading).toEqual(true);
        });

        it('should call designationAccounts.load', () => {
            $ctrl.load();
            expect(designationAccounts.load).toHaveBeenCalledWith(true);
        });

        describe('promise is successful', () => {
            it('should set loading to false', (done) => {
                $ctrl.loading = true;
                $ctrl.load().then(() => {
                    expect($ctrl.loading).toEqual(false);
                    done();
                });
                scope.$digest();
            });

            it('should call updateTotal', (done) => {
                spyOn($ctrl, 'updateTotal').and.returnValue(0);
                $ctrl.load().then(() => {
                    expect($ctrl.updateTotal).toHaveBeenCalled();
                    done();
                });
                scope.$digest();
            });
        });
    });

    describe('onToggle', () => {
        let designation = { active: true };

        it('should set active designation to inactive', () => {
            designation.active = true;
            $ctrl.onToggle(designation);
            expect(designation.active).toEqual(false);
        });

        it('should set inactive designation to active', () => {
            designation.active = false;
            $ctrl.onToggle(designation);
            expect(designation.active).toEqual(true);
        });

        it('should call updateTotal', () => {
            spyOn($ctrl, 'updateTotal').and.returnValue(0);
            $ctrl.onToggle(designation);
            expect($ctrl.updateTotal).toHaveBeenCalled();
        });
    });

    describe('updateTotal', () => {
        it('should set converted_total to 0', () => {
            designationAccounts.data = [];
            $ctrl.updateTotal();
            expect($ctrl.converted_total).toEqual(0);
        });

        describe('active designations', () => {
            beforeEach(() => {
                designationAccounts.data = [
                    { active: true, converted_balance: 1 },
                    { active: true, converted_balance: 10 },
                    { active: true, converted_balance: 100 }
                ];
            });

            it('should set converted_total to total of active accounts', () => {
                $ctrl.updateTotal();
                expect($ctrl.converted_total).toEqual(111);
            });
        });

        describe('inactive designations', () => {
            beforeEach(() => {
                designationAccounts.data = [
                    { active: false, converted_balance: 1 },
                    { active: false, converted_balance: 10 },
                    { active: false, converted_balance: 100 }
                ];
            });

            it('should set converted_total to total of active accounts', () => {
                $ctrl.updateTotal();
                expect($ctrl.converted_total).toEqual(0);
            });
        });

        describe('active and inactive designations', () => {
            beforeEach(() => {
                designationAccounts.data = [
                    { active: true, converted_balance: 1 },
                    { active: false, converted_balance: 1 },
                    { active: true, converted_balance: 10 },
                    { active: false, converted_balance: 10 },
                    { active: true, converted_balance: 100 },
                    { active: false, converted_balance: 100 }
                ];
            });

            it('should set converted_total to total of active accounts', () => {
                $ctrl.updateTotal();
                expect($ctrl.converted_total).toEqual(111);
            });
        });
    });
});
