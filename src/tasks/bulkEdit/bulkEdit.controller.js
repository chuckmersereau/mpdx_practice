class EditTaskController {
    ajaxAction;
    contacts;
    serverConstants;
    tagsService;
    tasksTags;

    constructor(
        $scope,
        tasksTags, tasksService, serverConstants,
        taskIds, modalCallback
    ) {
        this.$scope = $scope;
        this.serverConstants = serverConstants;
        this.tasksTags = tasksTags;
        this.tasksService = tasksService;
        this.taskIds = taskIds;
        this.modalCallback = modalCallback;

        this.constants = {};

        this.activate();
    }
    activate() {
        this.serverConstants.fetchConstants(['actions', 'next_actions', 'results']);
        this.constants = this.serverConstants.data;

        this.models = {};
    }
    submit() {
        this.tasksService.bulkEditTasks(
            this.taskIds,
            this.models
        ).then(() => {
            this.$scope.$hide();
            this.modalCallback();
        });
    }
}
export default angular.module('mpdx.tasks.bulkEdit.controller', [])
    .controller('bulkEditTaskController', EditTaskController).name;
