import service from './filter.service';

describe('tasks.filter.service', () => {
    let tasksFilter, tasksTags, rootScope;
    beforeEach(() => {
        angular.mock.module(service);
        inject((_tasksFilter_, _tasksTags_, $rootScope) => {
            tasksFilter = _tasksFilter_;
            tasksTags = _tasksTags_;
            rootScope = $rootScope;
        });
    });

    describe('change', () => {
        beforeEach(() => {
            spyOn(tasksFilter, 'handleFilterChange').and.callFake(() => {});
        });

        it('should reset the selected saved filter', () => {
            tasksFilter.selectedSave = 'a';
            tasksFilter.change('a');
            expect(tasksFilter.selectedSave).toEqual(null);
        });

        it('should call handleFilterChange', () => {
            tasksFilter.change('a');
            expect(tasksFilter.handleFilterChange).toHaveBeenCalledWith('a');
        });

        it('should broadcast the change globally', (done) => {
            rootScope.$on('tasksFilterChange', () => {
                done();
            });
            tasksFilter.change('a');
            rootScope.$digest();
        });
    });

    describe('reset', () => {
        it('should reset the selected saved filter', () => {
            tasksFilter.selectedSave = 'a';
            tasksFilter.reset();
            expect(tasksFilter.selectedSave).toBeUndefined();
        });
    });

    describe('handleFilterChange', () => {
        const params = {
            activity: ['']
        };
        const filter = { name: 'activity' };
        beforeEach(() => {
            tasksFilter.params = params;
            tasksFilter.defaultParams = params;
        });

        it('should handle undefined', () => {
            tasksFilter.handleFilterChange();
            expect(tasksFilter.params).toEqual(params);
        });

        it('should compact arrays with values', () => {
            tasksFilter.params.activity.push('a');
            tasksFilter.handleFilterChange(filter);
            expect(tasksFilter.params.activity).toEqual(['a']);
        });

        it('should default arrays without values', () => {
            tasksFilter.params.activity = [];
            tasksFilter.handleFilterChange(filter);
            expect(tasksFilter.params.activity).toEqual(params.activity);
        });
    });

    describe('invertMultiselect', () => {
        const params = {
            'a': ''
        };
        const filter: any = {
            name: 'a',
            type: 'multiselect'
        };
        beforeEach(() => {
            tasksFilter.params = params;
            spyOn(tasksFilter, 'change').and.callFake(() => {});
        });

        it('should set reverse param', () => {
            tasksFilter.invertMultiselect(filter);
            expect(tasksFilter.params.reverse_a).toBeTruthy();
            tasksFilter.invertMultiselect(filter);
            expect(tasksFilter.params.reverse_a).toBeUndefined();
        });

        it('should set filter.reverse', () => {
            tasksFilter.invertMultiselect(filter);
            expect(filter.reverse).toBeTruthy();
            tasksFilter.invertMultiselect(filter);
            expect(filter.reverse).toBeFalsy();
        });

        it('should call change', () => {
            tasksFilter.invertMultiselect(filter);
            expect(tasksFilter.change).toHaveBeenCalledWith();
        });

        it('should handle non-multiselect', () => {
            tasksFilter.invertMultiselect({ name: 'a' });
            expect(tasksFilter.params.a).toEqual('');
        });
    });

    describe('removeFilter', () => {
        const params = {
            'a': 'a',
            'reverse_a': true
        };
        const defaultParams = {
            'a': ''
        };
        const filter: any = { name: 'a' };
        beforeEach(() => {
            tasksFilter.params = params;
            tasksFilter.defaultParams = defaultParams;
            spyOn(tasksFilter, 'change').and.callFake(() => {});
        });

        it('should remove the filter from params', () => {
            tasksFilter.removeFilter(filter);
            expect(tasksFilter.params.a).toEqual('');
        });

        it('should remove the reverse filter from params', () => {
            tasksFilter.removeFilter(filter);
            expect(tasksFilter.params.reverse_a).toBeUndefined();
        });

        it('should set filter.reverse to false', () => {
            tasksFilter.removeFilter(filter);
            expect(filter.reverse).toBeFalsy();
        });
    });

    describe('showReset', () => {
        it('should be truthy', () => {
            spyOn(tasksFilter, 'isResettable').and.callFake(() => true);
            spyOn(tasksTags, 'isResettable').and.callFake(() => true);
            expect(tasksFilter.showReset()).toBeTruthy();
        });

        it('should be truthy', () => {
            spyOn(tasksFilter, 'isResettable').and.callFake(() => false);
            spyOn(tasksTags, 'isResettable').and.callFake(() => true);
            expect(tasksFilter.showReset()).toBeTruthy();
        });

        it('should be truthy', () => {
            spyOn(tasksFilter, 'isResettable').and.callFake(() => true);
            spyOn(tasksTags, 'isResettable').and.callFake(() => false);
            expect(tasksFilter.showReset()).toBeTruthy();
        });

        it('should be falsy', () => {
            spyOn(tasksFilter, 'isResettable').and.callFake(() => false);
            spyOn(tasksTags, 'isResettable').and.callFake(() => false);
            expect(tasksFilter.showReset()).toBeFalsy();
        });
    });
});
