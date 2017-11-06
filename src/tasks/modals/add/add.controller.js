class AddTaskController {
    constructor(
        $log, $rootScope, $scope, $state,
        serverConstants, tasks, tasksTags, users,
        resolveObject
    ) {
        this.$log = $log;
        this.$rootScope = $rootScope;
        this.$scope = $scope;
        this.$state = $state;
        this.serverConstants = serverConstants;
        this.tasksTags = tasksTags;
        this.tasks = tasks;
        this.users = users;

        /* istanbul ignore next */
        $log.debug('Add task params', resolveObject);

        this.contactsList = [];
        this.task = resolveObject.task;
        this.contactsList = resolveObject.contactsList;
        this.setDueDate = true;
    }
    save() {
        this.task.start_at = this.setDueDate ? this.task.start_at : null;
        return this.tasks.create(
            this.task,
            this.contactsList,
            this.comment
        ).then(() => {
            this.$rootScope.$emit('taskAdded');
            this.$scope.$hide();
        });
    }
}

import serverConstants from 'common/serverConstants/serverConstants.service';
import tasks from '../../tasks.service';

export default angular.module('mpdx.tasks.modals.add.controller', [
    serverConstants, tasks
]).controller('addTaskController', AddTaskController).name;
