import { assign } from 'lodash/fp';
import remove from './removeTags.controller';

describe('tasks.modals.removeTags.controller', () => {
    let $ctrl, controller, tasksTags, scope, rootScope, api, modal, gettextCatalog, q;

    function defaultScope() {
        return {
            $scope: scope,
            selectedTasks: [{ id: 1, tag_list: ['b'] }, { id: 2, tag_list: ['a'] }],
            currentListSize: 25
        };
    }

    function loadController(scope) {
        return controller('removeTaskTagController as $ctrl', scope);
    }

    beforeEach(() => {
        angular.mock.module(remove);
        inject(($controller, $rootScope, _tasksTags_, _api_, _modal_, _gettextCatalog_, $q) => {
            rootScope = $rootScope.$new();
            scope = rootScope.$new();
            api = _api_;
            api.account_list_id = 123;
            gettextCatalog = _gettextCatalog_;
            modal = _modal_;
            tasksTags = _tasksTags_;
            q = $q;
            tasksTags.data = [{ name: 'b' }, { name: 'c' }];
            controller = $controller;
            $ctrl = loadController(defaultScope());
        });
    });

    describe('removeTag', () => {
        beforeEach(() => {
            spyOn(api, 'delete').and.callFake(() => q.resolve({}));
            spyOn(modal, 'confirm').and.callFake(() => q.resolve({}));
            spyOn(gettextCatalog, 'getString').and.callFake((data) => data);
            scope.$hide = () => {};
            spyOn(scope, '$hide').and.callThrough();
            spyOn($ctrl.$rootScope, '$emit').and.callFake(() => {});
        });

        it('should confirm with a translated message', () => {
            const message = 'Are you sure you wish to remove the selected tag?';
            $ctrl.removeTag('a');
            expect(modal.confirm).toHaveBeenCalledWith(message);
            expect(gettextCatalog.getString).toHaveBeenCalledWith(message);
        });

        it('should remove a tag from selected contacts', (done) => {
            const successMessage = 'Tag successfully removed.';
            $ctrl.removeTag('a').then(() => {
                expect(api.delete).toHaveBeenCalledWith({
                    url: 'tasks/tags/bulk',
                    data: {
                        data: [{
                            data: {
                                attributes: {
                                    name: 'a'
                                }
                            }
                        }],
                        filter: {
                            account_list_id: api.account_list_id,
                            task_ids: '1,2'
                        },
                        fields: {
                            tasks: ''
                        },
                        type: 'tags'
                    },
                    autoParams: false,
                    doSerialization: false,
                    successMessage: successMessage
                });
                expect(gettextCatalog.getString).toHaveBeenCalledWith(successMessage);
                done();
            });
            scope.$digest();
        });

        it('should emit the deletion', (done) => {
            $ctrl.removeTag('a').then(() => {
                expect($ctrl.$rootScope.$emit).toHaveBeenCalledWith('taskTagDeleted', { taskIds: [1, 2], tag: 'a' });
                done();
            });
            scope.$digest();
        });

        it('should hide the modal', (done) => {
            $ctrl.removeTag('a').then(() => {
                expect(scope.$hide).toHaveBeenCalledWith();
                done();
            });
            scope.$digest();
        });
    });

    describe('getTagsFromSelectedTasks', () => {
        it('should show a sorted list of tags', () => {
            expect($ctrl.getTagsFromSelectedTasks()).toEqual(['a', 'b']);
        });

        it('should show a complete list of tags if selected > data', () => {
            $ctrl = loadController(assign(defaultScope(), { currentListSize: 1 }));
            expect($ctrl.getTagsFromSelectedTasks()).toEqual(['b', 'c']);
        });
    });
});