import component from './balances.component';

describe('reports.balances.component', () => {
    let $ctrl, rootScope, scope, designationAccounts, q;

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _designationAccounts_, _accounts_, $q) => {
            rootScope = $rootScope;
            q = $q;
            scope = $rootScope.$new();
            designationAccounts = _designationAccounts_;
            spyOn(rootScope, '$on').and.callThrough();
            $ctrl = $componentController('balances', { $scope: scope }, { view: null });
        });
    });

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
        });
    });

    describe('onToggle', () => {
        let designationAccount = { active: true };

        it('should set active designation to inactive', () => {
            designationAccount.active = true;
            $ctrl.onToggle(designationAccount);
            expect(designationAccount.active).toEqual(false);
        });

        it('should set inactive designation to active', () => {
            designationAccount.active = false;
            $ctrl.onToggle(designationAccount);
            expect(designationAccount.active).toEqual(true);
        });

        it('should call designationAccounts.save', () => {
            spyOn(designationAccounts, 'save');
            $ctrl.onToggle(designationAccount);
            expect(designationAccounts.save).toHaveBeenCalledWith(designationAccount);
        })
    });
});
