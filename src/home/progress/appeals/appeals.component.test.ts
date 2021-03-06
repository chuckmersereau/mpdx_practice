import component from './appeals.component';

const result = { id: 1 };

describe('home.progress.appeals.component', () => {
    let $ctrl, scope, rootScope, accounts, appealsShow, q;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _accounts_, _appealsShow_, $q) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            accounts = _accounts_;
            appealsShow = _appealsShow_;
            q = $q;
            $ctrl = $componentController('progressAppeals', { $scope: scope });
        });
    });

    describe('$onInit', () => {
        beforeEach(() => {
            spyOn(appealsShow, 'getAppeal').and.callFake(() => q.resolve(result));
            accounts.current = { primary_appeal: {} };
        });

        it('should return null if no primary appeal', () => {
            expect($ctrl.$onInit()).toEqual(null);
            expect(appealsShow.getAppeal).not.toHaveBeenCalled();
        });

        it('should call getPrimaryAppeal if defined', (done) => {
            accounts.current.primary_appeal.id = 123;
            $ctrl.$onInit().then(() => {
                expect(appealsShow.getAppeal).toHaveBeenCalledWith(123);
                done();
            });
            scope.$digest();
        });
    });

    describe('getPrimaryAppeal', () => {
        beforeEach(() => {
            spyOn(appealsShow, 'getAppeal').and.callFake(() => q.resolve(result));
        });

        it('should query api for a count and return it', (done) => {
            $ctrl.getPrimaryAppeal(1).then(() => {
                expect($ctrl.appeal).toBe(result);
                done();
            });
            expect(appealsShow.getAppeal).toHaveBeenCalledWith(1);
            scope.$digest();
        });
    });
});