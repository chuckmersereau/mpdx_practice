class EditTaskController {
    ajaxAction;
    selectedContacts;
    contacts;
    createNext;
    modal;
    serverConstants;
    tasksTags;
    tasksService;

    constructor(
        $log, $scope,
        modal, contacts, tasksTags, tasksService, serverConstants,
        selectedContacts, specifiedTask, ajaxAction, toComplete, createNext, modalCallback
    ) {
        this.$log = $log;
        this.$scope = $scope;
        this.ajaxAction = ajaxAction;
        this.selectedContacts = selectedContacts;
        this.contacts = contacts;
        this.createNext = createNext;
        this.modal = modal;
        this.serverConstants = serverConstants;
        this.tasksTags = tasksTags;
        this.tasksService = tasksService;
        this.toComplete = toComplete || false;
        this.modalCallback = modalCallback;

        this.model = _.clone(specifiedTask);
        this.constants = {};

        this.activate();
    }
    activate() {
        // this.serverConstants.fetchConstants(['actions', 'next_actions', 'results']);
        this.constants = this.serverConstants.data;
    }
    submit() {
        if (this.comment) {
            if (!this.model.comments) {
                this.model.comments = [];
            }
            this.model.comments.push({body: this.comment});
        }
        this.tasksService.postBulkLogTask(
            this.ajaxAction || 'post',
            this.model.id ? this.model.id : null,
            this.model,
            this.selectedContacts,
            this.toComplete
        ).then(() => {
            this.$scope.$hide();
            if (this.createNext && this.models.nextAction) {
                this.modal.open({
                    template: require('../../tasks/add/add.html'),
                    controller: 'addTaskController',
                    locals: {
                        specifiedAction: this.models.nextAction,
                        specifiedSubject: this.models.nextAction,
                        selectedContacts: this.selectedContacts,
                        modalTitle: 'Follow up Task'
                    },
                    onHide: () => {
                        if (this.selectedContacts.length === 1) {
                            this.tasksService.fetchUncompletedTasks(this.selectedContacts[0]);
                        }
                        this.contacts.load(true);
                    }
                });
            }
        });
    }
    deleteTask() {
        this.tasksService.deleteTask(this.specifiedTask.id).then((status) => {
            if (status) {
                this.$scope.$hide();
                this.modalCallback();
            }
        });
    }
}
export default angular.module('mpdx.tasks.edit.controller', [])
    .controller('editTaskController', EditTaskController).name;
