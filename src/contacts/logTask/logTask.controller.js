class LogTaskController {
    ajaxAction;
    selectedContacts;
    contacts;
    createNext;
    modal;
    serverConstants;
    tags;
    tasksService;

    constructor(
        $scope,
        modal, contacts, tags, tasksService, serverConstants,
        selectedContacts, specifiedTask, ajaxAction, toComplete, createNext
    ) {
        this.$scope = $scope;
        this.ajaxAction = ajaxAction;
        this.selectedContacts = selectedContacts;
        this.contacts = contacts;
        this.createNext = createNext;
        this.modal = modal;
        this.serverConstants = serverConstants;
        this.specifiedTask = specifiedTask;
        this.tags = tags;
        this.tasksService = tasksService;
        this.toComplete = toComplete;

        this.constants = {};

        this.activate();
    }
    activate() {
        this.serverConstants.fetchConstants(['actions', 'next_actions', 'results']);
        this.constants = this.serverConstants.data;

        var inputTask = this.specifiedTask || {};
        this.models = {
            dueDate: inputTask.due_date ? new Date(inputTask.due_date) : new Date(),
            completedAt: inputTask.completed_at ? new Date(inputTask.completed_at) : new Date(),
            noDate: inputTask.no_date !== false,
            subject: inputTask.subject,
            action: inputTask.activity_type,
            result: inputTask.result,
            nextAction: inputTask.next_action,
            tagsList: inputTask.tag_list ? inputTask.tag_list : []
        };
    }
    submit() {
        this.tasksService.postBulkLogTask(
            this.ajaxAction || 'post',
            this.specifiedTask ? this.specifiedTask.id : null,
            this.models,
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
}
export default angular.module('mpdx.contacts.logTask.controller', [])
    .controller('logTaskController', LogTaskController).name;
