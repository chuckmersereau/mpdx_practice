import component from './header.component';

xdescribe('common.filters.header.component', () => {
    let $ctrl, scope, componentController;

    function loadController() {
        const bindings = {
            invertFilter: () => {},
            removeFilter: () => {},
            selectedTags: ['abc', 'def'],
            rejectedTags: ['hij']
        };
        $ctrl = componentController('filtersHeader', { $scope: scope }, bindings);
    }

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope) => {
            scope = $rootScope.$new();
            componentController = $componentController;
            loadController();
        });
    });

    describe('constructor', () => {
        it('should set default values', () => {
            expect($ctrl.isCollapsed).toEqual(true);
        });
    });

    describe('invert', () => {
        const filter = { test: 123 };
        it('should call invertFilter', () => {
            spyOn($ctrl, 'invertFilter').and.callFake(() => {});
            $ctrl.invert(filter);
            expect($ctrl.invertFilter).toHaveBeenCalledWith({ $filter: filter });
        });
    });

    describe('remove', () => {
        const filter = { test: 123 };
        it('should call removeFilter', () => {
            spyOn($ctrl, 'removeFilter').and.callFake(() => {});
            $ctrl.remove(filter);
            expect($ctrl.removeFilter).toHaveBeenCalledWith({ $filter: filter });
        });
    });

    describe('count', () => {
        const filterParams = {
            status: 'none,active',
            commitment_amount: '1',
            commitment_currency: ['CAD'],
            newsletter: 'both'
        };
        const filterDefaultParams = {
            status: 'space',
            commitment_amount: '0',
            commitment_currency: ['CAD'],
            newsletter: 'both'
        };
        const filters = [{
            type: 'container',
            children: [
                {
                    type: 'multiselect',
                    name: 'status'
                }
            ]
        }, {
            type: 'text',
            name: 'commitment_amount'
        }, {
            type: 'multiselect',
            name: 'commitment_currency'
        }, {
            type: 'multiselect',
            name: 'newsletter',
            reverse: true
        }];
        beforeEach(() => {
            $ctrl.filterParams = filterParams;
            $ctrl.filterDefaultParams = filterDefaultParams;
            $ctrl.filters = filters;
        });

        it('should total active filters', () => {
            expect($ctrl.count()).toEqual(6);
        });
    });

    describe('filterInUse', () => {
        describe('filter is reversed', () => {
            const filter = { reverse: true };
            it('should return true', () => {
                expect($ctrl.filterInUse(filter)).toEqual(true);
            });
        });

        describe('filter is container', () => {
            const filter = { type: 'container' };
            it('should return false', () => {
                expect($ctrl.filterInUse(filter)).toEqual(false);
            });
        });

        describe('filter is unchanged', () => {
            const filterParams = {
                newsletter: 'both'
            };
            const filterDefaultParams = {
                newsletter: 'both'
            };
            const filter = { name: 'newsletter', type: 'multiselect' };
            beforeEach(() => {
                $ctrl.filterParams = filterParams;
                $ctrl.filterDefaultParams = filterDefaultParams;
            });

            it('should return false', () => {
                expect($ctrl.filterInUse(filter)).toEqual(false);
            });
        });

        describe('filter is changed', () => {
            const filterParams = {
                newsletter: 'email'
            };
            const filterDefaultParams = {
                newsletter: 'both'
            };
            const filter = { name: 'newsletter', type: 'multiselect' };
            beforeEach(() => {
                $ctrl.filterParams = filterParams;
                $ctrl.filterDefaultParams = filterDefaultParams;
            });

            it('should return true', () => {
                expect($ctrl.filterInUse(filter)).toEqual(true);
            });
        });

        describe('filter is has no contents', () => {
            const filterParams = {
                newsletter: ''
            };
            const filterDefaultParams = {
                newsletter: 'both'
            };
            const filter = { name: 'newsletter', type: 'multiselect' };
            beforeEach(() => {
                $ctrl.filterParams = filterParams;
                $ctrl.filterDefaultParams = filterDefaultParams;
            });

            it('should return true', () => {
                expect($ctrl.filterInUse(filter)).toEqual(false);
            });
        });
    });

    describe('display', () => {
        describe('filter count > 0', () => {
            beforeEach(() => {
                spyOn($ctrl, 'count').and.returnValue(1);
            });

            describe('displayFilters is true', () => {
                beforeEach(() => {
                    $ctrl.displayFilters = () => true;
                });

                it('should return true', () => {
                    expect($ctrl.display()).toEqual(true);
                });
            });

            describe('displayFilters is false', () => {
                beforeEach(() => {
                    $ctrl.displayFilters = () => false;
                });

                it('should return false', () => {
                    expect($ctrl.display()).toEqual(false);
                });
            });
        });

        describe('filter count == 0', () => {
            beforeEach(() => {
                spyOn($ctrl, 'count').and.returnValue(0);
            });

            describe('displayFilters is true', () => {
                beforeEach(() => {
                    $ctrl.displayFilters = () => true;
                });

                it('should return false', () => {
                    expect($ctrl.display()).toEqual(false);
                });
            });

            describe('displayFilters is false', () => {
                beforeEach(() => {
                    $ctrl.displayFilters = () => false;
                });

                it('should return false', () => {
                    expect($ctrl.display()).toEqual(false);
                });
            });
        });
    });
});
