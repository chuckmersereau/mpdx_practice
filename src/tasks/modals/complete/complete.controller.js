import contains from 'lodash/fp/contains';
import createPatch from 'common/fp/createPatch';
import defaultTo from 'lodash/fp/defaultTo';
import isEmpty from 'lodash/fp/isEmpty';
import map from 'lodash/fp/map';
import union from 'lodash/fp/union';

class CompleteTaskController {
    constructor(
        $log, $q, $scope,
        serverConstants, tasks, contacts,
        task
    ) {
        this.$log = $log;
        this.$q = $q;
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
        /* istanbul ignore next */
        this.$log.debug('task patch', patch);
        promises.push(this.tasks.save(
            patch,
            this.comment
        ));
        return this.$q.all(promises).then(() => {
            this.$scope.$hide();
            if (this.task.next_action) {
                this.tasks.addModal({
                    activityType: this.task.next_action,
                    comments: union(defaultTo([], this.task.comments), defaultTo([], this.comment)),
                    contactsList: map('id', this.task.contacts),
                    task: this.task
                });
            }
        });
    }
    showPartnerStatus() {
        return !isEmpty(this.task.contacts)
            && this.task.activity_type
            && !contains(this.task.activity_type, [
                'Pre Call Letter',
                'Reminder Letter',
                'Support Letter',
                'Thank',
                'To Do'
            ]);
    }
}

import contacts from 'contacts/contacts.service';
import serverConstants from 'common/serverConstants/serverConstants.service';
import tasks from 'tasks/tasks.service';

export default angular.module('mpdx.tasks.modals.complete.controller', [
    contacts, serverConstants, tasks
]).controller('completeTaskController', CompleteTaskController).name;
