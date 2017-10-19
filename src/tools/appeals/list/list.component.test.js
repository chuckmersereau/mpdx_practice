import component from './list.component';

describe('tools.appeals.list.component', () => {
    let $ctrl, scope, api, accounts;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _api_, _accounts_) => {
            scope = $rootScope.$new();
            api = _api_;
            api.account_list_id = 123;
            accounts = _accounts_;
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
    describe('canLoadMore', () => {
        it('should return false if loading', () => {
            $ctrl.loading = true;
            expect($ctrl.canLoadMore()).toBeFalsy();
        });
        it('should return false if no more pages', () => {
            $ctrl.loading = false;
            $ctrl.page = 1;
            $ctrl.meta = { pagination: { total_pages: 1 } };
            expect($ctrl.canLoadMore()).toBeFalsy();
        });
        it('should return true', () => {
            $ctrl.loading = false;
            $ctrl.page = 1;
            $ctrl.meta = { pagination: { total_pages: 2 } };
            expect($ctrl.canLoadMore()).toBeTruthy();
        });
    });
    describe('loadMoreAppeals', () => {
        it('should load more appeals', (done) => {
            $ctrl.page = 1;
            spyOn($ctrl, 'canLoadMore').and.callFake(() => true);
            spyOn($ctrl, 'load').and.callFake(() => Promise.resolve());
            $ctrl.loadMoreAppeals().then(() => {
                expect($ctrl.load).toHaveBeenCalledWith(2);
                done();
            });
        });
        it('should load more appeals', () => {
            $ctrl.page = 1;
            spyOn($ctrl, 'canLoadMore').and.callFake(() => false);
            spyOn($ctrl, 'load').and.callFake(() => Promise.resolve());
            $ctrl.loadMoreAppeals();
            expect($ctrl.load).not.toHaveBeenCalled();
        });
    });
    describe('load', () => {
        const retVal = [];
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
            spyOn(api, 'get').and.callFake(() => Promise.resolve(retVal));
            $ctrl.load();
            expect(api.get).toHaveBeenCalledWith('appeals', {
                include: 'donations',
                fields: {
                    appeals: 'amount,donations,name,pledges_amount_not_received_not_processed,pledges_amount_processed,pledges_amount_received_not_processed',
                    donations: 'converted_amount'
                },
                filter: { account_list_id: 123 },
                sort: '-created_at',
                page: 1
            });
        });
        it('should test for out of turn loading', (done) => {
            spyOn(api, 'get').and.callFake(() => Promise.resolve(retVal));
            spyOn($ctrl, 'loadedOutOfTurn').and.callFake(() => true);
            $ctrl.load().then((data) => {
                expect(data).toBeUndefined();
                done();
            });
        });
        it('should set page loading to false', (done) => {
            spyOn(api, 'get').and.callFake(() => Promise.resolve(retVal));
            $ctrl.load().then(() => {
                expect($ctrl.loading).toEqual(false);
                done();
            });
        });
        it('should set meta', (done) => {
            spyOn(api, 'get').and.callFake(() => Promise.resolve(retVal));
            $ctrl.load().then(() => {
                expect($ctrl.meta).toEqual('a');
                done();
            });
        });
        it('should mutate data', (done) => {
            spyOn(api, 'get').and.callFake(() => Promise.resolve(retVal));
            spyOn($ctrl, 'resetOrAppendData').and.callFake(() => []);
            spyOn($ctrl, 'mutateData').and.callFake(() => ['b']);
            $ctrl.load().then(() => {
                expect($ctrl.data).toEqual([]);
                done();
            });
        });
        it('should reset or append data', (done) => {
            spyOn(api, 'get').and.callFake(() => Promise.resolve(retVal));
            spyOn($ctrl, 'resetOrAppendData').and.callFake(() => ['b']);
            spyOn($ctrl, 'mutateData').and.callFake(() => []);
            $ctrl.load().then(() => {
                expect($ctrl.data).toEqual(['b']);
                done();
            });
        });
        it('should set loading to false on fail', (done) => {
            spyOn(api, 'get').and.callFake(() => Promise.reject());
            $ctrl.load().catch(() => {
                done();
            });
        });
    });
    describe('mutateData', () => {
        it('should modify data', () => {
            const data = [{
                amount: '10',
                donations: [{ converted_amount: '10' }]
            }, {
                amount: '12',
                donations: [{ converted_amount: '11' }]
            }];
            expect($ctrl.mutateData(data)).toEqual([{
                amount: '10.00',
                amount_raised: '10.00',
                donations: [{ converted_amount: '10' }]
            }, {
                amount: '12.00',
                amount_raised: '11.00',
                donations: [{ converted_amount: '11' }]
            }]);
        });
        it('should handle appeal 0', () => {
            const data = [{
                amount: null,
                donations: [{ converted_amount: '10' }]
            }];
            expect($ctrl.mutateData(data)).toEqual([{
                amount: '0.00',
                amount_raised: '10.00',
                donations: [{ converted_amount: '10' }]
            }]);
        });
    });
    describe('loadedOutOfTurn', () => {
        it('should return true if reset & wrong load count', () => {
            $ctrl.listLoadCount = 0;
            expect($ctrl.loadedOutOfTurn(true, 1)).toBeTruthy();
        });
        it('shouldn\'t return true if not reset & wrong load count', () => {
            $ctrl.listLoadCount = 0;
            expect($ctrl.loadedOutOfTurn(false, 1)).toBeFalsy();
        });
        it('shouldn\'t return true if reset & correct count', () => {
            $ctrl.listLoadCount = 0;
            expect($ctrl.loadedOutOfTurn(true, 0)).toBeFalsy();
        });
        it('shouldn\'t return true if not reset & correct count', () => {
            $ctrl.listLoadCount = 0;
            expect($ctrl.loadedOutOfTurn(false, 0)).toBeFalsy();
        });
    });
    describe('resetOrAppendData', () => {
        const initialData = [{ id: 'a' }];
        const secondData = [{ id: 'b' }];
        it('should remove initial data', () => {
            $ctrl.data = initialData;
            expect($ctrl.resetOrAppendData(true, secondData)).toEqual([{ id: 'b' }]);
        });
        it('should append additional data', () => {
            $ctrl.data = initialData;
            expect($ctrl.resetOrAppendData(false, secondData)).toEqual([{ id: 'a' }, { id: 'b' }]);
        });
    });
    describe('onPrimary', () => {
        it('should set the primary appeal id', () => {
            spyOn(accounts, 'saveCurrent').and.callFake(() => {});
            accounts.current = { primary_appeal: { } };
            $ctrl.onPrimary(1);
            expect(accounts.current.primary_appeal.id).toEqual(1);
            expect(accounts.saveCurrent).toHaveBeenCalledWith();
        });
    });
});
