import list from './list.component';

describe('tasks.list.component', () => {
    let $ctrl, scope, componentController, modal, tasks;
    beforeEach(() => {
        angular.mock.module(list);
        inject(($componentController, $rootScope, _modal_, _tasks_) => {
            scope = $rootScope.$new();
            modal = _modal_;
            tasks = _tasks_;
            componentController = $componentController;
            loadController();
        });
    });
    function loadController() {
        $ctrl = componentController('tasksList', { $scope: scope }, { view: null, selected: null });
    }
    describe('openRemoveTagModal', () => {
        beforeEach(() => {
            spyOn(modal, 'open').and.callFake(() => {});
        });
        it('should open the remove tag modal', () => {
            $ctrl.openRemoveTagModal();
            expect(modal.open).toHaveBeenCalledWith({
                template: require('../modals/removeTags/removeTags.html'),
                controller: 'removeTaskTagController',
                locals: {
                    selectedTasks: $ctrl.getSelectedTasks(),
                    currentListSize: tasks.data.length
                }
            });
        });
    });
    describe('getSelectedTasks', () => {
        it('should get tasks for selected ids', () => {
            tasks.selected = [1, 2];
            tasks.data = [{ id: 1, name: 'a' }, { id: 2, name: 'b' }];
            expect($ctrl.getSelectedTasks()).toEqual(tasks.data);
        });
    });
});