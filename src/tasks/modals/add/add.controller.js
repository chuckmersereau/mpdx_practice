class AddTaskController {
    comment;
    constructor(
        $scope,
        tasksTags, serverConstants, tasks, contacts, users,
        contactsList, activityType
    ) {
        this.$scope = $scope;
        this.contacts = contacts;
        this.tasksTags = tasksTags;
        this.serverConstants = serverConstants;
        this.tasks = tasks;
        this.users = users;

        this.contactsList = angular.copy(contactsList);
        this.task = { activity_type: activityType };
        this.setDueDate = true;
    }
    addContact() {
        this.contactsList.push('');
    }
    save() {
        if (!this.setDueDate) {
            this.task.start_at = null;
        }
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
