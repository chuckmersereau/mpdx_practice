import add from './add.controller';

describe('tasks.filter.tags.add.controller', () => {
    let $ctrl, scope, api, rootScope, tasksTags, q;
    beforeEach(() => {
        angular.mock.module(add);
        inject(($controller, $rootScope, _api_, _tasksTags_, $q) => {
            rootScope = $rootScope;
            scope = $rootScope.$new();
            scope.$hide = () => {};
            api = _api_;
            api.account_list_id = 123;
            tasksTags = _tasksTags_;
            q = $q;
            $ctrl = $controller('addTaskTagController as $ctrl', {
                $scope: scope,
                selectedTasks: []
            });
        });
    });

    describe('save', () => {
        it('should save a custom tag', (done) => {
            $ctrl.tags = [];
            spyOn(api, 'post').and.callFake(() => q.resolve());
            $ctrl.save('a').then(() => {
                expect(api.post).toHaveBeenCalledWith({
                    url: 'tasks/tags/bulk',
                    data: {
                        data: [{
                            data: {
                                type: 'tags',
                                attributes: { name: 'a' }
                            }
                        }],
                        filter: {
                            account_list_id: 123,
                            task_ids: ''
                        },
                        fields: {
                            tasks: ''
                        }
                    },
                    doSerialization: false,
                    autoParams: false
                });
                done();
            });
            scope.$digest();
        });

        it('should add tag', (done) => {
            $ctrl.tags = [];
            spyOn(api, 'post').and.callFake(() => q.resolve());
            spyOn(rootScope, '$emit').and.callFake(() => {});
            spyOn(tasksTags, 'addTag').and.callFake(() => {});
            $ctrl.save('a').then(() => {
                expect(rootScope.$emit).toHaveBeenCalledWith('taskTagsAdded', { tags: ['a'], taskIds: [] });
                expect(tasksTags.addTag).toHaveBeenCalledWith({ tags: ['a'], taskIds: [] });
                done();
            });
            scope.$digest();
        });

        it('should hide', (done) => {
            $ctrl.tags = [];
            spyOn(api, 'post').and.callFake(() => q.resolve());
            spyOn(rootScope, '$emit').and.callFake(() => {});
            spyOn(tasksTags, 'addTag').and.callFake(() => {});
            spyOn(scope, '$hide').and.callFake(() => {});
            $ctrl.save('a').then(() => {
                expect(scope.$hide).toHaveBeenCalledWith();
                done();
            });
            scope.$digest();
        });
    });
});