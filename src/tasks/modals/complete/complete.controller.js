class CompleteTaskController {
    constructor(
        $scope,
        tasksTags, serverConstants, tasks, users,
        task
    ) {
        this.$scope = $scope;
        this.serverConstants = serverConstants;
        this.tasksTags = tasksTags;
        this.tasks = tasks;
        this.users = users;

        this.task = angular.copy(task);
        this.task.completed = true;
    }
    save() {
        return this.tasks.save(
            this.task,
            this.comment
        ).then(() => {
            this.$scope.$hide();
        });
    }
}

export default angular.module('mpdx.tasks.complete.controller', [])
    .controller('completeTaskController', CompleteTaskController).name;
