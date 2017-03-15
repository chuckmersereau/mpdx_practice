import uuid from 'uuid/v1';

class LogTaskController {
    ajaxAction;
    selectedContacts;
    contacts;
    contactsTags;
    createNext;
    modal;
    serverConstants;
    tasks;
    users;

    constructor(
        $scope,
        modal, contacts, contactsTags, tasks, serverConstants, users,
        selectedContacts, specifiedTask, ajaxAction, toComplete, createNext
    ) {
        this.$scope = $scope;
        this.ajaxAction = ajaxAction;
        this.selectedContacts = selectedContacts;
        this.contacts = contacts;
        this.contactsTags = contactsTags;
        this.createNext = createNext;
        this.modal = modal;
        this.serverConstants = serverConstants;
        this.tasks = tasks;
        this.toComplete = toComplete;
        this.users = users;

        this.model = angular.copy(specifiedTask);
    }
    save() {
        if (this.comment) {
            if (!this.model.comments) {
                this.model.comments = [];
            }
            this.model.comments.push({id: uuid(), body: this.comment, person: { id: this.users.current.id }});
        }
        return this.tasks.postBulkLogTask(
            this.ajaxAction || 'post',
            this.model.id ? this.model.id : null,
            this.model,
            this.selectedContacts,
            this.toComplete
        ).then(() => {
            this.$scope.$hide();
            if (this.createNext && this.models.nextAction) {
                this.modal.open({
                    template: require('../add/add.html'),
                    controller: 'addTaskController',
                    locals: {
                        specifiedAction: this.models.nextAction,
                        specifiedSubject: this.models.nextAction,
                        selectedContacts: this.selectedContacts,
                        modalTitle: 'Follow up Task'
                    },
                    onHide: () => {
                        if (this.selectedContacts.length === 1) {
                            this.tasks.fetchUncompletedTasks(this.selectedContacts[0]);
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
