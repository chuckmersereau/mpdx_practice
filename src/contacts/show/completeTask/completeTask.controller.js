class CompleteTaskController {
    contact;
    modal;
    serverConstants;
    tasksService;

    constructor(
        $scope, modal, serverConstants, tasksService,
        task, contact, taskAction
    ) {
        this.$scope = $scope;
        this.contact = contact;
        this.modal = modal;
        this.serverConstants = serverConstants;
        this.task = task;
        this.taskAction = taskAction;
        this.tasksService = tasksService;

        // this.serverConstants.fetchConstants(['next_actions', 'results']);
    }
    save() {
        return this.tasksService.postLogTask(this.task, this.models).then(() => {
            this.$scope.$hide();

            var contactIds = [];
            if (this.contact) {
                contactIds = [this.contact.id];
            }

            this.modal.open({
                template: require('../../../tasks/add/add.html'),
                controller: 'addTaskController',
                locals: {
                    specifiedAction: this.models.nextAction,
                    specifiedSubject: this.models.nextAction,
                    selectedContacts: contactIds,
                    modalTitle: 'Follow up Task'
                }
            });
        });
    }
}

export default angular.module('mpdx.contacts.show.completeTask.controller', [])
    .controller('completeTaskController', CompleteTaskController).name;
