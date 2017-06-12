import component from './people.component';

describe('tools.merge.people.component', () => {
    let mergePeople, rootScope, scope, componentController;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _mergePeople_) => {
            rootScope = $rootScope;
            scope = $rootScope.$new();
            mergePeople = _mergePeople_;
            componentController = $componentController;
            loadController();
        });
    });
    function loadController() {
        componentController('mergePeople', {$scope: scope}, {});
    }
    describe('events', () => {
        it('should handle account list change', () => {
            spyOn(mergePeople, 'load').and.callFake(() => {});
            rootScope.$emit('accountListUpdated');
            rootScope.$digest();
            expect(mergePeople.load).toHaveBeenCalledWith(true);
        });
    });
});