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

        this.watcher = $scope.$watch('$ctrl.task.start_at', (newVal, oldVal) => {
            const isOld = isNilOrEmpty(newVal) && !isNilOrEmpty(oldVal);
            this.task.notification_time_before = isOld ? null : this.task.notification_time_before;
            this.task.notification_type = isOld ? null : this.task.notification_type;
        });

        this.watcher2 = $scope.$watch('$ctrl.task.notification_time_before', (newVal, oldVal) => {
            const isNew = !isNilOrEmpty(newVal) && isNilOrEmpty(oldVal);
            const isOld = isNilOrEmpty(newVal) && !isNilOrEmpty(oldVal);
            this.task.notification_type = isNew
                ? 'both'
                : isOld
                    ? null
                    : this.task.notification_type;
        });

        $scope.$on('$destroy', () => {
            this.watcher();
            this.watcher2();
        });
    }
    save() {
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
