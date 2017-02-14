import uuid from 'uuid/v1';

class CompleteTaskController {
    contact;
    modal;
    serverConstants;
    tasksService;
    users;

    constructor(
        $scope,
        modal, serverConstants, tasksService, users,
        task, contact, taskAction
    ) {
        this.$scope = $scope;
        this.contact = contact;
        this.modal = modal;
        this.serverConstants = serverConstants;
        this.taskAction = taskAction;
        this.tasksService = tasksService;
        this.users = users;

        this.models = _.clone(task);
        this.models.completed = true;
    }
    save() {
        if (this.comment) {
            if (!this.models.comments) {
                this.models.comments = [];
            }
            this.models.comments.push({id: uuid(), body: this.comment, person: { id: this.users.current.id }});
        }
        return this.tasksService.save(this.models).then(() => {
            this.$scope.$hide();

            let contactIds = [];
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
