import component from './monthly.component';

describe('reports.monthly.component', () => {
    let $ctrl, rootScope, scope, api, designationAccounts, q;

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _api_, _designationAccounts_, $q) => {
            rootScope = $rootScope;
            api = _api_;
            designationAccounts = _designationAccounts_;
            q = $q;
            scope = rootScope.$new();
            $ctrl = $componentController('monthly', { $scope: scope }, {});
        });
    });

    describe('constructor', () => {
        it('should define variables', () => {
            expect($ctrl.sumOfAllCategories).toEqual(0);
            expect($ctrl.errorOccurred).toEqual(false);
            expect($ctrl.loading).toEqual(true);
            expect($ctrl.activePanels).toEqual([0, 1, 2]);
        });
    });

    describe('$onInit', () => {
        afterEach(() => {
            $ctrl.$onDestroy();
        });

        it('should define watchers', () => {
            $ctrl.$onInit();
            expect($ctrl.watcher).toBeDefined();
            expect($ctrl.watcher2).toBeDefined();
        });

        describe('events', () => {
            beforeEach(() => {
                $ctrl.$onInit();
            });

            it('should handle accountListUpdated', () => {
                spyOn($ctrl, 'load').and.callThrough();
                rootScope.$emit('accountListUpdated');
                expect($ctrl.load).toHaveBeenCalled();
            });

            it('should handle designationAccountSelectorChanged', () => {
                spyOn($ctrl, 'load').and.callThrough();
                rootScope.$emit('designationAccountSelectorChanged');
                expect($ctrl.load).toHaveBeenCalled();
            });
        });
    });

    describe('$onDestroy', () => {
        beforeEach(() => {
            $ctrl.$onInit();
        });

        it('should call watchers', () => {
            spyOn($ctrl, 'watcher').and.callThrough();
            spyOn($ctrl, 'watcher2').and.callThrough();
            $ctrl.$onDestroy();
            expect($ctrl.watcher).toHaveBeenCalled();
            expect($ctrl.watcher2).toHaveBeenCalled();
        });
    });

    describe('load', () => {
        beforeEach(() => {
            spyOn(api, 'get').and.callFake((url, data) => q.resolve(data));
        });

        it('should return a promise', () => {
            expect($ctrl.load()).toEqual(jasmine.any(q));
        });

        it('should call api.get', () => {
            $ctrl.load();
            expect(api.get).toHaveBeenCalledWith(
                'reports/expected_monthly_totals',
                {
                    filter: {
                        account_list_id: api.account_list_id
                    }
                }
            );
        });

        describe('selected designationAccounts', () => {
            beforeEach(() => {
                designationAccounts.selected = ['abc', 'def'];
            });

            it('should call api.get', () => {
                $ctrl.load();
                expect(api.get).toHaveBeenCalledWith(
                    'reports/expected_monthly_totals',
                    {
                        filter: {
                            account_list_id: api.account_list_id,
                            designation_account_id: 'abc,def'
                        }
                    }
                );
            });
        });
    });
});
