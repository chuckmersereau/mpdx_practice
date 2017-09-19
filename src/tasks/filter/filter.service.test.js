import service from './filter.service';

describe('tasks.filter.service', () => {
    let tasksFilter, rootScope;
    beforeEach(() => {
        angular.mock.module(service);
        inject(($rootScope, _tasksFilter_) => {
            rootScope = $rootScope;
            tasksFilter = _tasksFilter_;
        });
    });
    xit('should do something', () => {
        expect(tasksFilter).toEqual(1);
        expect(rootScope).toEqual(1);
    });
});
