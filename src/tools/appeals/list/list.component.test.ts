import component from './list.component';

describe('tools.appeals.list.component', () => {
    let $ctrl, scope, api, q;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _api_, $q) => {
            scope = $rootScope.$new();
            api = _api_;
            q = $q;
            api.account_list_id = 123;
            $ctrl = $componentController('appealsList', { $scope: scope }, {});
        });
    });

    describe('events', () => {
        it('should handle account list change', () => {
            spyOn($ctrl, 'load').and.callFake(() => {});
            scope.$emit('accountListUpdated');
            scope.$digest();
            expect($ctrl.load).toHaveBeenCalledWith();
        });
    });

    describe('$onInit', () => {
        it('should call load', () => {
            spyOn($ctrl, 'load').and.callFake(() => {});
            $ctrl.$onInit();
            expect($ctrl.load).toHaveBeenCalledWith();
        });
    });

    describe('load', () => {
        const retVal: any = [];
        retVal.meta = 'a';
        beforeEach(() => {
            $ctrl.meta = { id: 1 };
            $ctrl.data = ['a'];
            $ctrl.totals = { a: 'b' };
            $ctrl.listLoadCount = 1;
        });

        it('should reset values by default', () => {
            $ctrl.load();
            expect($ctrl.meta).toEqual({});
            expect($ctrl.data).toEqual([]);
            expect($ctrl.totals).toEqual({});
            expect($ctrl.listLoadCount).toEqual(2);
            expect($ctrl.page).toEqual(1);
        });

        it('should set page loading to true', () => {
            $ctrl.load();
            expect($ctrl.loading).toEqual(true);
        });

        it('should call the api', () => {
            spyOn(api, 'get').and.callFake(() => q.resolve(retVal));
            $ctrl.load();
            expect(api.get).toHaveBeenCalledWith('appeals', {
                fields: {
                    appeals: 'amount,name,pledges_amount_not_received_not_processed,pledges_amount_processed,pledges_amount_received_not_processed'
                },
                filter: { account_list_id: 123 },
                sort: '-created_at',
                page: 1
            });
        });

        it('should test for out of turn loading', (done) => {
            spyOn(api, 'get').and.callFake(() => q.resolve(retVal));
            spyOn($ctrl, 'loadedOutOfTurn').and.callFake(() => true);
            $ctrl.load().then((data) => {
                expect(data).toBeUndefined();
                done();
            });
            scope.$digest();
        });

        it('should set page loading to false', (done) => {
            spyOn(api, 'get').and.callFake(() => q.resolve(retVal));
            $ctrl.load().then(() => {
                expect($ctrl.loading).toEqual(false);
                done();
            });
            scope.$digest();
        });

        it('should set meta', (done) => {
            spyOn(api, 'get').and.callFake(() => q.resolve(retVal));
            $ctrl.load().then(() => {
                expect($ctrl.meta).toEqual('a');
                done();
            });
            scope.$digest();
        });

        it('should mutate data', (done) => {
            spyOn(api, 'get').and.callFake(() => q.resolve(retVal));
            spyOn($ctrl, 'mutateData').and.callFake(() => ['b']);
            $ctrl.load().then(() => {
                expect($ctrl.data).toEqual(['b']);
                done();
            });
            scope.$digest();
        });

        it('should set loading to false on fail', (done) => {
            spyOn(api, 'get').and.callFake(() => q.reject({}));
            $ctrl.load().catch(() => {
                done();
            });
            scope.$digest();
        });
    });

    describe('mutateData', () => {
        it('should modify data', () => {
            const data = [{
                amount: '10',
                pledges_amount_processed: 10
            }, {
                amount: '12',
                pledges_amount_processed: 11
            }];
            expect($ctrl.mutateData(data)).toEqual([{
                amount: '10.00',
                pledges_amount_processed: '10.00'
            }, {
                amount: '12.00',
                pledges_amount_processed: '11.00'
            }]);
        });

        it('should handle appeal 0', () => {
            const data = [{
                amount: null,
                pledges_amount_processed: null
            }];
            expect($ctrl.mutateData(data)).toEqual([{
                amount: '0.00',
                pledges_amount_processed: '0.00'
            }]);
        });
    });

    describe('loadedOutOfTurn', () => {
        it('should return true if wrong load count', () => {
            $ctrl.listLoadCount = 0;
            expect($ctrl.loadedOutOfTurn(1)).toBeTruthy();
        });

        it('shouldn\'t return true if correct count', () => {
            $ctrl.listLoadCount = 0;
            expect($ctrl.loadedOutOfTurn(0)).toBeFalsy();
        });
    });
});
