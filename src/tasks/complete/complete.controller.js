import map from 'lodash/fp/map';
import uuid from 'uuid/v1';

class CompleteTaskController {
    contact;
    modal;
    serverConstants;
    tasks;
    users;

    constructor(
        $log, $scope,
        modal, serverConstants, tasks, users,
        task, contact
    ) {
        this.$scope = $scope;
        this.contact = contact;
        this.modal = modal;
        this.serverConstants = serverConstants;
        this.tasks = tasks;
        this.users = users;

        this.models = angular.copy(task);
        $log.debug('opened task:', this.models);
        this.models.completed = true;
    }
    save() {
        if (this.comment) {
            if (!this.models.comments) {
                this.models.comments = [];
            }
            this.models.comments.push({id: uuid(), body: this.comment, person: { id: this.users.current.id }});
        }
        return this.tasks.save(this.models).then(() => {
            this.$scope.$hide();

            this.modal.open({
                template: require('../add/add.html'),
                controller: 'addTaskController',
                locals: {
                    specifiedAction: this.models.next_action,
                    specifiedSubject: this.models.next_action,
                    selectedContacts: map('id', this.models.contacts),
                    modalTitle: 'Follow up Task'
                }
            });
        });
    }
}

export default angular.module('mpdx.tasks.complete.controller', [])
    .controller('completeTaskController', CompleteTaskController).name;
