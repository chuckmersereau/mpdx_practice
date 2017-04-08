import indexOf from 'lodash/fp/indexOf';

class CompleteTaskController {
    comment;
    status;
    constructor(
        $q, $scope,
        serverConstants, tasks, contacts,
        task
    ) {
        this.$q = $q;
        this.$scope = $scope;
        this.serverConstants = serverConstants;
        this.tasks = tasks;
        this.contacts = contacts;

        this.task = angular.copy(task);
        this.task.completed = true;
    }
    save(promises = []) {
        if (this.status && this.task.contacts.length > 0) {
            promises.push(this.contacts.bulkEditFields({ status: this.status }, this.task.contacts));
        }
        promises.push(this.tasks.save(
            this.task,
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
