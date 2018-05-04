import service from './tags.service';

describe('tasks.tags.service', () => {
    let tasksTags, api;
    beforeEach(() => {
        angular.mock.module(service);
        inject(($rootScope, _tasksTags_, _api_) => {
            api = _api_;
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
    describe('delete', () => {
        const tag = { name: 'a' };
        beforeEach(() => {
            spyOn(api, 'delete').and.callFake(() => Promise.resolve());
        });
        it('should call api', () => {
            tasksTags.delete(tag);
            expect(api.delete).toHaveBeenCalledWith({
                url: 'tasks/tags/bulk',
                params: {
                    filter: {
                        account_list_id: api.account_list_id
                    }
                },
                data: [{
                    name: tag.name
                }],
                type: 'tags',
                fields: {
                    tasks: ''
                }
            });
        });
    });
});
