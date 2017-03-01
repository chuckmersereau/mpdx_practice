import uuid from 'uuid/v1';
import isEmpty from 'lodash/fp/isEmpty';
import reject from 'lodash/fp/reject';

class AddTaskController {
    selectedContacts;
    contacts;
    newsletterBoth;
    newsletterEmail;
    newsletterPhysical;
    serverConstants;
    tasksService;
    tasksTags;
    users;

    constructor(
        $scope, $state,
        tasksTags, serverConstants, tasksService, contacts, users,
        selectedContacts, specifiedAction, specifiedSubject, modalTitle
    ) {
        this.$scope = $scope;
        this.$state = $state;
        this.selectedContacts = selectedContacts;
        this.contacts = contacts;
        this.tasksTags = tasksTags;
        this.serverConstants = serverConstants;
        this.specifiedAction = specifiedAction;
        this.specifiedSubject = specifiedSubject;
        this.tasksService = tasksService;
        this.users = users;

        this.modalTitle = modalTitle;

        this.model = {
            start_at: moment().toISOString(),
            no_date: false,
            activity_type: this.specifiedAction,
            subject: this.specifiedSubject,
            tag_list: [],
            comments: []
        };
        this.emailNotification = false;
    }
    addContact() {
        this.selectedContacts.push('');
    }
    save() {
        if (this.comment) {
            this.model.comments.push({id: uuid(), body: this.comment, person: { id: this.users.current.id }});
        }
        if (this.emailNotification) {
            this.model.notification_type = 'email';
        }
        this.selectedContacts = reject('', this.selectedContacts); //dump empty contacts

        let promise;
        if (this.newsletterBoth) {
            this.model.action = "Newsletter - Physical";
            promise = this.tasksService.create(this.model, this.selectedContacts).then(() => {
                this.model.action = "Newsletter - Email";
                return this.tasksService.create(this.model, this.selectedContacts);
            });
        } else if (this.newsletterPhysical) {
            this.model.action = "Newsletter - Physical";
            promise = this.tasksService.create(this.model, this.selectedContacts);
        } else if (this.newsletterEmail) {
            this.model.action = "Newsletter - Email";
            promise = this.tasksService.create(this.model, this.selectedContacts);
        } else if (!isEmpty(this.model.action)) {
            promise = this.tasksService.create(this.model, this.selectedContacts);
        } else {
            return;
        }
        return promise.then(() => {
            this.contacts.load(true);
            this.tasksTags.load();
            this.$scope.$hide();
            this.$state.go('tasks');
        });
    }
}
export default angular.module('mpdx.tasks.add.controller', [])
    .controller('addTaskController', AddTaskController).name;
