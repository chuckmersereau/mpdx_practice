class LogTaskController {
    ajaxAction;
    contacts;
    contactsService;
    createNext;
    modal;
    serverConstants;
    contactsTagsService;
    tasksService;

    constructor(
        $scope,
        modal, contactsService, contactsTagsService, tasksService, serverConstants,
        contacts, specifiedTask, ajaxAction, toComplete, createNext
    ) {
        this.$scope = $scope;
        this.ajaxAction = ajaxAction;
        this.contacts = contacts;
        this.contactsService = contactsService;
        this.createNext = createNext;
        this.modal = modal;
        this.serverConstants = serverConstants;
        this.specifiedTask = specifiedTask;
        this.tagsService = contactsTagsService;
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
            this.contacts,
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
                        contacts: this.contacts,
                        modalTitle: 'Follow up Task'
                    },
                    onHide: () => {
                        if (this.contacts.length === 1) {
                            this.tasksService.fetchUncompletedTasks(this.contacts[0]);
                        }
                        this.contactsService.load(true);
                    }
                });
            }
        });
    }
}
export default angular.module('mpdx.contacts.logTask.controller', [])
    .controller('logTaskController', LogTaskController).name;
