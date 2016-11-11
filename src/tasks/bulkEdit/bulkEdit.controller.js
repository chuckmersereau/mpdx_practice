class EditTaskController {
    ajaxAction;
    contacts;
    serverConstants;
    contactsTagsService;
    tasksService;

    constructor(
        $scope,
        contactsTagsService, tasksService, serverConstants,
        taskIds, modalCallback
    ) {
        this.$scope = $scope;
        this.serverConstants = serverConstants;
        this.tagsService = contactsTagsService;
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
export default angular.module('mpdx.tasks.edit.controller', [])
    .controller('bulkEditTaskController', EditTaskController).name;
