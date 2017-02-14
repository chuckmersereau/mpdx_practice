import uuid from 'uuid/v1';

class AddTaskController {
    selectedContacts;
    contacts;
    newsletterBoth;
    newsletterEmail;
    newsletterPhysical;
    serverConstants;
    tasksService;
    tasksTags;

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

        this.models = {
            start_at: moment().toISOString(),
            no_date: false,
            activity_type: this.specifiedAction,
            subject: this.specifiedSubject,
            tag_list: [],
            comments: []
        };
        this.emailNotification = false;
    }

    save() {
        if (this.comment) {
            this.models.comments.push({id: uuid(), body: this.comment, person: { id: this.users.current.id }});
        }
        if (this.emailNotification) {
            this.models.notification_type = 'email';
        }
        let promise;
        if (this.newsletterBoth) {
            this.models.action = "Newsletter - Physical";
            promise = this.tasksService.create(this.models, this.selectedContacts).then(() => {
                this.models.action = "Newsletter - Email";
                return this.tasksService.create(this.models, this.selectedContacts);
            });
        } else if (this.newsletterPhysical) {
            this.models.action = "Newsletter - Physical";
            promise = this.tasksService.create(this.models, this.selectedContacts);
        } else if (this.newsletterEmail) {
            this.models.action = "Newsletter - Email";
            promise = this.tasksService.create(this.models, this.selectedContacts);
        } else {
            promise = this.tasksService.create(this.models, this.selectedContacts);
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
