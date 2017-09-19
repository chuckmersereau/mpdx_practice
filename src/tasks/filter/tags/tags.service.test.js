import service from './tags.service';

describe('tasks.tags.service', () => {
    let tasksTags, rootScope;
    beforeEach(() => {
        angular.mock.module(service);
        inject(($rootScope, _tasksTags_) => {
            rootScope = $rootScope;
            tasksTags = _tasksTags_;
        });
    });
    xit('should do something', () => {
        expect(tasksTags).toEqual(1);
        expect(rootScope).toEqual(1);
    });
});
