import indexOf from 'lodash/fp/indexOf';
import map from 'lodash/fp/map';
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
        if (this.status && this.showPartnerStatus()) {
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
            if (this.task.next_action) {
                this.tasks.addModal(map('id', this.task.contacts), this.task.next_action);
            }
        });
    }
    showPartnerStatus() {
        return this.task.contacts.length > 0 && this.task.activity_type && indexOf(this.task.activity_type, ['Pre Call Letter', 'Reminder Letter', 'Support Letter', 'Thank', 'To Do']) === -1;
    }
}

export default angular.module('mpdx.tasks.complete.controller', [])
    .controller('completeTaskController', CompleteTaskController).name;
