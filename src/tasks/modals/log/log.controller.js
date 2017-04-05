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
    }
    addContact() {
        this.contactsList.push('');
    }
    save() {
        return this.tasks.create(
            this.model,
            this.contactsList,
            this.comment
        ).then(() => {
            this.$scope.$hide();
        });
    }
}
export default angular.module('mpdx.contacts.logTask.controller', [])
    .controller('logTaskController', LogTaskController).name;
