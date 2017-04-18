import reduce from 'lodash/fp/reduce';

class AddTaskController {
    comment;
    contactNames;
    constructor(
        $scope,
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
        this.task = { activity_type: activityType };
        this.setDueDate = true;
        this.contactNames = null;

        this.activate();
    }
    activate() {
        this.contacts.getNames(this.contactsList).then((data) => {
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
export default angular.module('mpdx.tasks.add.controller', [])
    .controller('addTaskController', AddTaskController).name;
