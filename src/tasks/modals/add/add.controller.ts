import { defaultTo, map } from 'lodash/fp';
import isNilOrEmpty from '../../../common/fp/isNilOrEmpty';
import serverConstants, { ServerConstantsService } from '../../../common/serverConstants/serverConstants.service';
import tasks, { TasksService } from '../../tasks.service';
import tasksTags, { TasksTagsService } from '../../filter/tags/tags.service';

class AddTaskController {
    comment: any;
    contactsList: any[];
    task: any;
    watcher: () => void;
    watcher2: () => void;
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

export default angular.module('mpdx.tasks.modals.add.controller', [
    serverConstants, tasks, tasksTags
]).controller('addTaskController', AddTaskController).name;
