import component from './filter.component';

describe('common.filters.header.filter.component', () => {
    let $ctrl, scope, componentController;

    function loadController() {
        $ctrl = componentController('filtersHeaderFilter', { $scope: scope }, {});
    }

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope) => {
            scope = $rootScope.$new();
            componentController = $componentController;
            loadController();
        });
    });

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
