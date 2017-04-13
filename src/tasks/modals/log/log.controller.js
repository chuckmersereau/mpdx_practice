import indexOf from 'lodash/fp/indexOf';

class LogTaskController {
    comment;
    model;
    task;
    constructor(
        $scope,
        contacts, tasks, tasksTags, serverConstants, users,
        contactsList
    ) {
        this.$scope = $scope;
        this.contacts = contacts;
        this.serverConstants = serverConstants;
        this.tasksTags = tasksTags;
        this.tasks = tasks;
        this.users = users;

        this.contactsList = angular.copy(contactsList);
        this.task = { completed: true };
    }
    addContact() {
        this.contactsList.push('');
    }
    save(promises = []) {
        if (this.status && this.showPartnerStatus()) {
            promises.push(this.contacts.bulkEditFields({ status: this.status }, this.task.contacts));
        }
        promises.push(this.tasks.create(
            this.task,
            this.contactsList,
            this.comment
        ));
        return this.$q.all(promises).then(() => {
            this.$scope.$hide();
            if (this.task.next_action) {
                this.tasks.addModal(this.contactsList, this.task.next_action);
            }
        });
    }
    showPartnerStatus() {
        return this.contactsList.length > 0 && this.task.activity_type && indexOf(this.task.activity_type, ['Pre Call Letter', 'Reminder Letter', 'Support Letter', 'Thank', 'To Do']) === -1;
    }
}
export default angular.module('mpdx.contacts.logTask.controller', [])
    .controller('logTaskController', LogTaskController).name;
