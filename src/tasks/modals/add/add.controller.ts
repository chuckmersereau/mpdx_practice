import { defaultTo, map } from 'lodash/fp';
import isNilOrEmpty from '../../../common/fp/isNilOrEmpty';

class AddTaskController {
    comment: any;
    contactsList: any[];
    task: any;
    constructor(
        private $log: ng.ILogService,
        private $rootScope: ng.IRootScopeService,
        private $scope: mgcrea.ngStrap.modal.IModalScope,
        private serverConstants: ServerConstantsService,
        private tasks: TasksService,
        private tasksTags: TasksTagsService,
        resolveObject: any
    ) {
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

import serverConstants, { ServerConstantsService } from '../../../common/serverConstants/serverConstants.service';
import tasks, { TasksService } from '../../tasks.service';
import tasksTags, { TasksTagsService } from '../../filter/tags/tags.service';

export default angular.module('mpdx.tasks.modals.add.controller', [
    serverConstants, tasks, tasksTags
]).controller('addTaskController', AddTaskController).name;
