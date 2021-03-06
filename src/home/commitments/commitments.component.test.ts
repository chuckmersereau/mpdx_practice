import component from './commitments.component';

describe('home.commitments', () => {
    let $ctrl, rootScope, scope, api, q;

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _api_, $q) => {
            rootScope = $rootScope;
            api = _api_;
            q = $q;
            api.account_list_id = 111;
            scope = rootScope.$new();
            $ctrl = $componentController('homeCommitments', { $scope: scope }, {});
        });
    });

    describe('$onInit', () => {
        beforeEach(() => {
            spyOn($ctrl, 'load').and.callFake(() => q.resolve('a'));
        });

        it('should load', () => {
            $ctrl.$onInit();
            expect($ctrl.load).toHaveBeenCalledWith();
        });

        it('should load on account list change', () => {
            $ctrl.$onInit();
            expect($ctrl.watcher).toBeDefined();
            rootScope.$emit('accountListUpdated');
            rootScope.$digest();
            expect($ctrl.load).toHaveBeenCalledWith();
        });
    });

    describe('$onDestroy', () => {
        it('should destroy the account list change watcher', () => {
            $ctrl.$onInit();
            spyOn($ctrl, 'watcher').and.callFake(() => {});
            $ctrl.$onDestroy();
            expect($ctrl.watcher).toHaveBeenCalledWith();
        });
    });

    describe('load', () => {
        beforeEach(() => {
            spyOn($ctrl, 'getAnalytics').and.callFake(() => q.resolve('a'));
        });

        it('should get analytics', () => {
            $ctrl.load();
            expect($ctrl.getAnalytics).toHaveBeenCalledWith();
        });

        it('should set analytics', (done) => {
            $ctrl.load().then(() => {
                expect($ctrl.analytics).toEqual('a');
                done();
            });
            scope.$digest();
        });
    });

    describe('getAnalytics', () => {
        beforeEach(() => {
            $ctrl.analytics = null;
        });

        it('should query the api', () => {
            spyOn(api, 'get').and.callFake(() => q.resolve());
            $ctrl.getAnalytics();
            expect(api.get).toHaveBeenCalledWith({
                url: 'contacts/analytics',
                data: {
                    filter: { account_list_id: api.account_list_id }
                },
                overrideGetAsPost: true
            });
        });
    });
});