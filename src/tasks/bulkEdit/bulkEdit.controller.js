class EditTaskController {
    contacts;
    serverConstants;
    tasksTags;

    constructor(
        $scope,
        tasksTags, tasksService, serverConstants,
        selectedTasks, modalCallback
    ) {
        this.$scope = $scope;
        this.serverConstants = serverConstants;
        this.tasksTags = tasksTags;
        this.tasksService = tasksService;
        this.selectedTasks = selectedTasks;
        this.modalCallback = modalCallback;

        this.activate();
    }
    activate() {
        this.models = {};
    }
    submit() {
        if (this.comment) {
            if (!this.models.comments) {
                this.models.comments = [];
            }
            this.models.comments.push({body: this.comment});
        }
        this.tasksService.bulkEditTasks(
            this.selectedTasks,
            this.models
        ).then(() => {
            this.$scope.$hide();
            this.modalCallback();
        });
    }
}
export default angular.module('mpdx.tasks.bulkEdit.controller', [])
    .controller('bulkEditTaskController', EditTaskController).name;
