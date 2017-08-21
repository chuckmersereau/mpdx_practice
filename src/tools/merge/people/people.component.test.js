import component from './people.component';

describe('tools.merge.people.component', () => {
    let $ctrl, mergePeople, rootScope, scope, componentController;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _mergePeople_) => {
            rootScope = $rootScope;
            scope = $rootScope.$new();
            mergePeople = _mergePeople_;
            componentController = $componentController;
            $ctrl = componentController('mergePeople', { $scope: scope }, {});
        });
    });

    describe('$onInit', () => {
        it('should handle account list change', () => {
            spyOn(mergePeople, 'load').and.callFake(() => {});
            $ctrl.$onInit();
            rootScope.$emit('accountListUpdated');
            rootScope.$digest();
            expect(mergePeople.load).toHaveBeenCalledWith(true);
        });
    });
});
