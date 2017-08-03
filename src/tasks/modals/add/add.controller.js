import reduce from 'lodash/fp/reduce';
import startsWith from 'lodash/fp/startsWith';
import union from 'lodash/fp/union';

class AddTaskController {
    constructor(
        $scope, $state,
        contacts, tasksTags, serverConstants, tasks, users,
        contactsList, activityType
    ) {
        this.$scope = $scope;
        this.contacts = contacts;
        this.serverConstants = serverConstants;
        this.tasksTags = tasksTags;
        this.tasks = tasks;
        this.users = users;

        this.contactsList = angular.copy(contactsList);
        if (startsWith('contacts.show', $state.current.name)) {
            this.contactsList = union(this.contactsList, [this.contacts.current.id]);
        }
        this.task = { activity_type: activityType };
        this.setDueDate = true;
        this.contactNames = null;

        this.activate();
    }
    activate() {
        return this.contacts.getNames(this.contactsList).then((data) => {
            this.contactNames = reduce((result, contact) => {
                result[contact.id] = contact.name;
                return result;
            }, {}, data);
        });
    }
    addContact() {
        this.contactsList.push('');
    }
    setContact(params, index) {
        if (!params) {
            return;
        }
        this.contactNames[params.id] = params.name; //set id if missing or out of date
        this.contactsList[index] = params.id;
    }
    save() {
        if (!this.setDueDate) {
            this.task.start_at = null;
        }
        return this.tasks.create(
            this.task,
            this.contactsList,
            this.comment
        ).then(() => {
            this.$scope.$hide();
        });
    }
}

import contacts from 'contacts/contacts.service';
import serverConstants from 'common/serverConstants/serverConstants.service';
import tasks from '../../tasks.service';

export default angular.module('mpdx.tasks.add.controller', [
    contacts, serverConstants, tasks
]).controller('addTaskController', AddTaskController).name;
