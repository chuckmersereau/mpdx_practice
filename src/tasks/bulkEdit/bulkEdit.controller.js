import uuid from 'uuid/v1';

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

        this.constants = {};

        this.activate();
    }
    activate() {
        // this.serverConstants.fetchConstants(['actions', 'next_actions', 'results']);
        this.constants = this.serverConstants.data;

        this.models = {};
    }
    submit() {
        if (this.comment) {
            if (!this.models.comments) {
                this.models.comments = [];
            }
            this.models.comments.push({id: uuid(), body: this.comment, person: { id: this.users.current.id }});
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
