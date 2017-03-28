class BulkEditTaskController {
    constructor(
        $scope,
        tasksTags, serverConstants, tasks, contacts, users
    ) {
        this.$scope = $scope;
        this.serverConstants = serverConstants;
        this.tasksTags = tasksTags;
        this.tasks = tasks;
        this.users = users;

        this.task = {};
    }
    save() {
        return this.tasks.bulkEdit(
            this.task,
            this.comment
        ).then(() => {
            this.$scope.$hide();
        });
    }
}
export default angular.module('mpdx.tasks.bulkEdit.controller', [])
    .controller('bulkEditTaskController', BulkEditTaskController).name;
