class BulkEditTaskController {
    constructor(
        $scope,
        tasksTags, serverConstants, tasks, users
    ) {
        this.$scope = $scope;
        this.serverConstants = serverConstants;
        this.tasksTags = tasksTags;
        this.tasks = tasks;
        this.users = users;

        this.task = {};
        this.tags = [];
    }
    save() {
        return this.tasks.bulkEdit(
            this.task,
            this.comment,
            this.tags
        ).then(() => {
            this.$scope.$hide();
        });
    }
}
export default angular.module('mpdx.tasks.bulkEdit.controller', [])
    .controller('bulkEditTaskController', BulkEditTaskController).name;
