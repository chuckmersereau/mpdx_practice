import createPatch from '../../../common/fp/createPatch';
import isNil from 'lodash/fp/isNil';

class EditTaskController {
    constructor(
        $log, $scope,
        modal, contacts, tasksTags, tasks, serverConstants, users,
        task
    ) {
        this.$log = $log;
        this.$scope = $scope;
        this.contacts = contacts;
        this.modal = modal;
        this.serverConstants = serverConstants;
        this.tasksTags = tasksTags;
        this.tasks = tasks;
        this.users = users;

        this.task = angular.copy(task);
        this.taskInitialState = angular.copy(task);

        if (isNil(this.task.start_at)) {
            this.no_date = true;
        }
    }
    save() {
        if (this.no_date) {
            this.task.start_at = null;
        }
        const patch = createPatch(this.taskInitialState, this.task);
        this.$log.debug('task patch', patch);
        return this.tasks.save(
            patch,
            this.comment
        ).then(() => {
            this.$scope.$hide();
        });
    }
    delete() {
        return this.tasks.delete(
            this.task
        ).then(() => {
            this.$scope.$hide();
        });
    }
}
export default angular.module('mpdx.tasks.edit.controller', [])
    .controller('editTaskController', EditTaskController).name;
