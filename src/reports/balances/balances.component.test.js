import component from './balances.component';

const fakeBlockUI = {
    reset: () => {},
    start: () => {}
};


describe('reports.balances.component', () => {
    let $ctrl, componentController, rootScope, scope, designationAccounts, blockUI;

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _designationAccounts_, _blockUI_) => {
            componentController = $componentController;
            rootScope = $rootScope;
            scope = $rootScope.$new();

            designationAccounts = _designationAccounts_;
            blockUI = _blockUI_;
            loadController();
        });
    });

    function loadController() {
        spyOn(blockUI.instances, 'get').and.callFake(() => fakeBlockUI);
        spyOn(rootScope, '$on').and.callThrough();
        $ctrl = componentController('balances', { $scope: scope }, { view: null });
        spyOn($ctrl.blockUI, 'reset').and.callThrough();
        spyOn($ctrl.blockUI, 'start').and.callThrough();
    }

    describe('constructor', () => {
        it('should set watcher on accountListUpdated', () => {
            expect(rootScope.$on.calls.mostRecent().args[0]).toEqual('accountListUpdated');
        });

        it('should get instance of blockUI', () => {
            expect(blockUI.instances.get).toHaveBeenCalledWith('balances');
            expect($ctrl.blockUI).toEqual(fakeBlockUI);
        });

        it('should call load when event accountListUpdated triggered', () => {
            spyOn($ctrl, 'load').and.callFake(() => Promise.resolve());
            rootScope.$emit('accountListUpdated');
            expect($ctrl.load).toHaveBeenCalled();
        });
    });

    describe('$onInit', () => {
        beforeEach(() => {
            spyOn($ctrl, 'load').and.callFake(() => Promise.resolve());
        });

        it('should call load', () => {
            $ctrl.$onInit();
            expect($ctrl.load).toHaveBeenCalled();
        });
    });

    describe('load', () => {
        beforeEach(() => {
            spyOn(designationAccounts, 'load').and.callFake((reset) => Promise.resolve(reset));
        });

        it('should return a promise', () => {
            expect($ctrl.load()).toEqual(jasmine.any(Promise));
        });

        it('should start blockUI', () => {
            $ctrl.load();
            expect($ctrl.blockUI.start).toHaveBeenCalled();
        });

        it('should call designationAccounts.load', () => {
            $ctrl.load();
            expect(designationAccounts.load).toHaveBeenCalledWith(true);
        });

        describe('promise is successful', () => {
            it('should reset blockUI', (done) => {
                $ctrl.load().then(() => {
                    expect($ctrl.blockUI.reset).toHaveBeenCalled();
                    done();
                });
            });

            it('should call updateTotal', (done) => {
                spyOn($ctrl, 'updateTotal').and.returnValue(0);
                $ctrl.load().then(() => {
                    expect($ctrl.updateTotal).toHaveBeenCalled();
                    done();
                });
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
