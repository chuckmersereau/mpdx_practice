import component from './appeals.component';

describe('home.progress.appeals.component', () => {
    let $ctrl, componentController, scope, rootScope, api;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _api_) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            api = _api_;
            api.account_list_id = 123;
            componentController = $componentController;
            loadController();
        });
    });

    function loadController() {
        $ctrl = componentController('progressAppeals', { $scope: scope });
    }
    describe('getCount', () => {
        const result = { meta: { pagination: { total_count: 1 } } };

        beforeEach(() => {
            spyOn(api, 'get').and.callFake(() => Promise.resolve(result));
        });

        it('should query api for a count and return it', (done) => {
            $ctrl.getCount().then((data) => {
                expect(data).toBe(1);
                done();
            });
            expect(api.get).toHaveBeenCalledWith('appeals', {
                fields: { appeals: '' },
                filter: { account_list_id: api.account_list_id },
                per_page: 0
            });
        });
    });

    describe('getCount - no results', () => {
        beforeEach(() => {
            spyOn(api, 'get').and.callFake(() => Promise.resolve({}));
        });

        it('should query api for a count and return it', (done) => {
            $ctrl.getCount().then((data) => {
                expect(data).toBe(0);
                done();
            });
            expect(api.get).toHaveBeenCalledWith('appeals', {
                fields: { appeals: '' },
                filter: { account_list_id: api.account_list_id },
                per_page: 0
            });
        });
    });
});