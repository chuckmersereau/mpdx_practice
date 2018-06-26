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

    describe('$onChanges', () => {
        it('should handle an array of filters', () => {
            $ctrl.filterParams = {
                status: ['a', 'b']
            };
            $ctrl.filter = {
                name: 'status',
                options: [
                    { id: 'a', name: 'aa' },
                    { id: 'b', name: 'bb' }
                ]
            };
            $ctrl.$onChanges();
            expect($ctrl.filters).toEqual(['aa', 'bb']);
        });

        it('should handle a single filter', () => {
            $ctrl.filterParams = {
                status: 'a'
            };
            $ctrl.filter = {
                name: 'status',
                options: [
                    { id: 'a', name: 'aa' },
                    { id: 'b', name: 'bb' }
                ]
            };
            $ctrl.$onChanges();
            expect($ctrl.filters).toEqual(['aa']);
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
});
