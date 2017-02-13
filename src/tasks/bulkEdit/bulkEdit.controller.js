class EditTaskController {
    contacts;
    serverConstants;
    tasksTags;
    users;

    constructor(
        $scope,
        tasksTags, tasksService, serverConstants, users,
        selectedTasks, modalCallback
    ) {
        this.$scope = $scope;
        this.serverConstants = serverConstants;
        this.tasksTags = tasksTags;
        this.tasksService = tasksService;
        this.selectedTasks = selectedTasks;
        this.modalCallback = modalCallback;
        this.users = users;

        this.activate();
    }
    activate() {
        this.models = {};
    }
    submit() {
        this.tasksService.bulkEditTasks(
            this.selectedTasks,
            this.models,
            this.comment
        ).then(() => {
            this.$scope.$hide();
            this.modalCallback();
        });
    }
}
export default angular.module('mpdx.tasks.bulkEdit.controller', [])
    .controller('bulkEditTaskController', EditTaskController).name;
