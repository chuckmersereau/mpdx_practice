import component from './header.component';


describe('common.filters.header.component', () => {
    let $ctrl, scope, componentController;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope) => {
            scope = $rootScope.$new();
            componentController = $componentController;
            loadController();
        });
    });

    function loadController() {
        $ctrl = componentController('headerFilterDisplay', { $scope: scope }, {});
    }

    describe('getOption', () => {
        const filter = {
            options: [
                { name: 'a', id: 1 },
                { name: 'b', id: 2 }
            ]
        };
        it('should return the selected option name by id', () => {
            expect($ctrl.getOption(filter, 1)).toEqual('a');
        });
        it('should handle null', () => {
            expect($ctrl.getOption({}, 1)).toBeUndefined();
        });
    });
    describe('isArray', () => {
        it('should catch an array', () => {
            expect($ctrl.isArray([])).toBeTruthy();
        });
        it('should catch an object', () => {
            expect($ctrl.isArray({})).toBeFalsy();
        });
    });
});