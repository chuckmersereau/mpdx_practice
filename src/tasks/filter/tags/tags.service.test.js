import service from './tags.service';

describe('tasks.tags.service', () => {
    let tasksTags;
    beforeEach(() => {
        angular.mock.module(service);
        inject(($rootScope, _tasksTags_) => {
            tasksTags = _tasksTags_;
        });
    });
    describe('addTag', () => {
        it('should add a tag to data', () => {
            tasksTags.data = [{ name: 'a' }];
            tasksTags.addTag({ tags: ['b'] });
            expect(tasksTags.data[1].name).toEqual('b');
        });
    });
});
