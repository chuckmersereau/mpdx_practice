import createPatch from '../../../common/fp/createPatch';
import { concat, find, map, reduce } from 'lodash/fp';
import isNilOrEmpty from '../../../common/fp/isNilOrEmpty';

class EditTaskController {
    task: any;
    taskInitialState: any
    constructor(
        private $log: ng.ILogService,
        private $scope: mgcrea.ngStrap.modal.IModalScope,
        private serverConstants: ServerConstantsService,
        private tasks: TasksService,
        private tasksTags: TasksTagsService,
        task: any
    ) {
        this.$log = $log;
        this.$scope = $scope;
        this.serverConstants = serverConstants;
        this.tasksTags = tasksTags;
        this.tasks = tasks;

        this.task = angular.copy(task);
        this.taskInitialState = angular.copy(task);
    }
    save() {
        this.handleActivityContacts();
        this.handleDates();
        this.task.notification_type = isNilOrEmpty(this.task.notification_time_before) ? null : 'email';

        let patch = createPatch(this.taskInitialState, this.task);
        /* istanbul ignore next */
        this.$log.debug('task patch', patch);

        return this.tasks.save(patch).then(() => {
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
    handleDates() {
        this.task.start_at = this.isoDateOrNull(this.task.start_at);
        this.task.completed_at = this.isoDateOrNull(this.task.completed_at);
    }
    isoDateOrNull(val) {
        return this.isIsoDate(val) ? val : null;
    }
    isIsoDate(s) {
        const isoDateRegExp = new RegExp(/(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/);
        return isoDateRegExp.test(s);
    }
    delete() {
        return this.tasks.delete(
            this.task
        ).then(() => {
            this.$scope.$hide();
        });
    }
}

import serverConstants, { ServerConstantsService } from '../../../common/serverConstants/serverConstants.service';
import tasksTags, { TasksTagsService } from '../../filter/tags/tags.service';
import tasks, { TasksService } from '../../tasks.service';

export default angular.module('mpdx.tasks.modals.edit.controller', [
    serverConstants, tasksTags, tasks
]).controller('editTaskController', EditTaskController).name;
