import indexOf from 'lodash/fp/indexOf';
import createPatch from '../../../common/fp/createPatch';

class CompleteTaskController {
    comment;
    constructor(
        $q, $log, $scope,
        serverConstants, tasks, contacts,
        task
    ) {
        this.$q = $q;
        this.$log = $log;
        this.$scope = $scope;
        this.serverConstants = serverConstants;
        this.tasks = tasks;
        this.contacts = contacts;

        this.task = angular.copy(task);
        this.taskInitialState = angular.copy(task);
        this.task.completed = true;
    }
    save(promises = []) {
        if (this.status && this.task.contacts.length > 0) {
            promises.push(this.contacts.bulkEditFields({ status: this.status }, this.task.contacts));
        }
        const patch = createPatch(this.taskInitialState, this.task);
        this.$log.debug('task patch', patch);
        promises.push(this.tasks.save(
            patch,
            this.comment
        ));
        return this.$q.all(promises).then(() => {
            this.$scope.$hide();
        });
    }
    showPartnerStatus() {
        return this.task.contacts.length > 0 && indexOf(this.task.activity_type, ['Call', 'Appointment']) >= 0;
    }
}

export default angular.module('mpdx.tasks.complete.controller', [])
    .controller('completeTaskController', CompleteTaskController).name;
