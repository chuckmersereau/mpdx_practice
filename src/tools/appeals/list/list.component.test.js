import component from './list.component';

describe('tools.appeals.list.component', () => {
    let $ctrl, scope;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope) => {
            scope = $rootScope.$new();
            $ctrl = $componentController('appealsList', { $scope: scope }, {});
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
    });
});
