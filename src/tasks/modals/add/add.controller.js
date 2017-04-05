class AddTaskController {
    constructor(
        $scope,
        tasksTags, serverConstants, tasks, contacts, users,
        contactsList
    ) {
        this.$scope = $scope;
        this.contacts = contacts;
        this.tasksTags = tasksTags;
        this.serverConstants = serverConstants;
        this.tasks = tasks;
        this.users = users;

        this.contactsList = angular.copy(contactsList);
        this.task = {};
    }
    addContact() {
        this.contactsList.push('');
    }
    save() {
        return this.tasks.create(
            this.task,
            this.contactsList,
            this.comment
        ).then(() => {
            this.$scope.$hide();
        });
    }
}
export default angular.module('mpdx.tasks.add.controller', [])
    .controller('addTaskController', AddTaskController).name;
