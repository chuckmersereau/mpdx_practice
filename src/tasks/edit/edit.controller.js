import uuid from 'uuid/v1';
import map from 'lodash/fp/map';
import union from 'lodash/fp/union';
import createPatch from "../../common/fp/createPatch";

class EditTaskController {
    ajaxAction;
    selectedContacts;
    contacts;
    createNext;
    modal;
    serverConstants;
    tasksTags;
    tasks;
    users;

    constructor(
        $log, $scope,
        modal, contacts, tasksTags, tasks, serverConstants, users,
        selectedContacts, specifiedTask, ajaxAction, toComplete, createNext, modalCallback
    ) {
        this.$log = $log;
        this.$scope = $scope;
        this.ajaxAction = ajaxAction;
        this.contacts = contacts;
        this.createNext = createNext;
        this.modal = modal;
        this.serverConstants = serverConstants;
        this.tasksTags = tasksTags;
        this.tasks = tasks;
        this.toComplete = toComplete || false;
        this.modalCallback = modalCallback;
        this.users = users;

        this.modelInitialState = angular.copy(specifiedTask);
        this.model = angular.copy(specifiedTask);

        const mapIds = map('id');
        this.selectedContacts = union(mapIds(this.model.contacts), mapIds(selectedContacts));
        if (this.model.notification_type) {
            this.emailNotification = true;
        }

        $log.debug('edit taks', this.model);
    }
    submit() {
        if (this.comment) {
            if (!this.model.comments) {
                this.model.comments = [];
            }
            this.model.comments.push({id: uuid(), body: this.comment, person: { id: this.users.current.id }});
        }
        const patch = createPatch(this.modelInitialState, this.model);
        this.$log.debug('task patch', patch);
        this.tasks.postBulkLogTask(
            this.ajaxAction || 'post',
            this.model.id ? this.model.id : null,
            patch,
            this.selectedContacts,
            this.toComplete
        ).then(() => {
            this.$scope.$hide();
            if (this.createNext && this.model.next_action) {
                this.modal.open({
                    template: require('../../tasks/add/add.html'),
                    controller: 'addTaskController',
                    locals: {
                        specifiedAction: this.model.next_action,
                        specifiedSubject: this.model.next_action,
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
    deleteTask() {
        this.tasks.deleteTask(this.model.id).then(() => {
            this.$scope.$hide();
            this.modalCallback();
        });
    }
}
export default angular.module('mpdx.tasks.edit.controller', [])
    .controller('editTaskController', EditTaskController).name;
