import createPatch from 'common/fp/createPatch';
import concat from 'lodash/fp/concat';
import find from 'lodash/fp/find';
import map from 'lodash/fp/map';
import isNil from 'lodash/fp/isNil';
import reduce from 'lodash/fp/reduce';

class EditTaskController {
    constructor(
        $log, $scope,
        serverConstants, tasks, tasksTags,
        task
    ) {
        this.$log = $log;
        this.$scope = $scope;
        this.serverConstants = serverConstants;
        this.tasksTags = tasksTags;
        this.tasks = tasks;

        this.task = angular.copy(task);
        this.taskInitialState = angular.copy(task);
        this.noDate = isNil(this.task.start_at);
    }
    save() {
        this.handleActivityContacts();
        if (this.noDate) {
            this.task.start_at = null;
        }
        let patch = createPatch(this.taskInitialState, this.task);
        /* istanbul ignore next */
        this.$log.debug('task patch', patch);

        return this.tasks.save(
            patch,
            this.comment
        ).then(() => {
            this.$scope.$hide();
        });
    }
    handleActivityContacts() {
        this.task.activity_contacts = map((activity) => {
            if (!find({ id: activity.contact.id }, this.task.contacts)) {
                activity._destroy = 1;
            }
            return activity;
        }, this.task.activity_contacts);
        this.task.contacts = reduce((result, value) => {
            return find((a) => a.contact.id === value.id, this.task.activity_contacts) ? result : concat(result, value);
        }, [], this.task.contacts);
    }
    delete() {
        return this.tasks.delete(
            this.task
        ).then(() => {
            this.$scope.$hide();
        });
    }
}

import serverConstants from 'common/serverConstants/serverConstants.service';
import tasksTags from 'tasks/filter/tags/tags.service';
import tasks from 'tasks/tasks.service';

export default angular.module('mpdx.tasks.modals.edit.controller', [
    serverConstants, tasksTags, tasks
]).controller('editTaskController', EditTaskController).name;
