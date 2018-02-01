import { defaultTo, map } from 'lodash/fp';
import isNilOrEmpty from 'common/fp/isNilOrEmpty';

class AddTaskController {
    constructor(
        $log, $rootScope, $scope,
        serverConstants, tasks, tasksTags,
        resolveObject
    ) {
        this.$log = $log;
        this.$rootScope = $rootScope;
        this.$scope = $scope;
        this.serverConstants = serverConstants;
        this.tasksTags = tasksTags;
        this.tasks = tasks;

        /* istanbul ignore next */
        $log.debug('Add task params', resolveObject);

        this.task = resolveObject.task;
        this.task.notification_time_unit = defaultTo('minutes', this.task.notification_time_unit);
        this.contactsList = resolveObject.contactsList;
    }
    save() {
        this.task.notification_type = isNilOrEmpty(this.task.notification_time_before) ? null : 'email';
        const contactIds = map('id', this.contactsList);
        return this.tasks.create(
            this.task,
            contactIds,
            this.comment
        ).then(() => {
            this.$rootScope.$emit('taskAdded');
            this.$scope.$hide();
        });
    }
}

import serverConstants from 'common/serverConstants/serverConstants.service';
import tasks from 'tasks/tasks.service';
import tasksTags from 'tasks/filter/tags/tags.service';

export default angular.module('mpdx.tasks.modals.add.controller', [
    serverConstants, tasks, tasksTags
]).controller('addTaskController', AddTaskController).name;
