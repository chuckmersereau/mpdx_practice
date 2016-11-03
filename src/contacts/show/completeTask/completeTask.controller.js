class CompleteTaskController {
    contact;
    modal;
    serverConstants;
    tasksService;

    constructor(
        modal, serverConstants, tasksService,
        taskId, contact, taskAction
    ) {
        this.contact = contact;
        this.modal = modal;
        this.serverConstants = serverConstants;
        this.taskId = taskId;
        this.taskAction = taskAction;
        this.tasksService = tasksService;

        this.activate();
    }
    activate() {
        this.serverConstants.fetchConstants(['nextActions', 'results', 'pledge_frequency']);
        this.constants = this.serverConstants.data;
    }
    submit() {
        this.tasksService.postLogTask(this.taskId, this.models).then(() => {
            this.$scope.$hide();
            this.modal.open({
                template: require('../../../tasks/add/add.html'),
                controller: 'addTaskController',
                locals: {
                    specifiedAction: this.models.nextAction,
                    specifiedSubject: this.models.nextAction,
                    contacts: [this.contact.id],
                    modalTitle: 'Follow up Task'
                }
            });
        });
    }
}

export default angular.module('mpdx.contacts.show.completeTask.controller', [])
    .controller('completeTaskController', CompleteTaskController);
