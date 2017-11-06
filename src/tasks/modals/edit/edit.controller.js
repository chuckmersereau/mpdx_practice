import createPatch from 'common/fp/createPatch';
import isNil from 'lodash/fp/isNil';
import keys from 'lodash/fp/keys';
import remove from 'lodash/fp/remove';

class EditTaskController {
    constructor(
        $log, $scope,
        contacts, modal, serverConstants, tasks, tasksTags, users,
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
        this.task.contacts = [];
        this.noDate = isNil(this.task.start_at);
    }

    save() {
        if (this.noDate) {
            this.task.start_at = null;
        }
        this.task.contacts = remove((contact) => {
            return keys(contact).length === 0;
        }, this.task.contacts);
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

    delete() {
        return this.tasks.delete(
            this.task
        ).then(() => {
            this.$scope.$hide();
        });
    }
}

import contacts from 'contacts/contacts.service';
import modal from 'common/modal/modal.service';
import serverConstants from 'common/serverConstants/serverConstants.service';
import tasksTags from 'tasks/filter/tags/tags.service';
import tasks from 'tasks/tasks.service';
import users from 'common/users/users.service';

export default angular.module('mpdx.tasks.modals.edit.controller', [
    contacts, modal, serverConstants, tasksTags, tasks, users
]).controller('editTaskController', EditTaskController).name;
