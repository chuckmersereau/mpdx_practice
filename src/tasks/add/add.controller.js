class AddTaskController {
    selectedContacts;
    contacts;
    contactsTags;
    serverConstants;
    tasksService;

    constructor(
        $scope,
        contactsTags, serverConstants, tasksService, contacts,
        selectedContacts, specifiedAction, specifiedSubject, modalTitle
    ) {
        this.$scope = $scope;
        this.selectedContacts = selectedContacts;
        this.contacts = contacts;
        this.contactsTags = contactsTags;
        this.serverConstants = serverConstants;
        this.specifiedAction = specifiedAction;
        this.specifiedSubject = specifiedSubject;
        this.tasksService = tasksService;

        this.modalTitle = modalTitle;

        this.models = {
            date: new Date(),
            noDate: false,
            action: this.specifiedAction,
            subject: this.specifiedSubject,
            tagsList: []
        };

        this.activate();
    }
    activate() {
        this.serverConstants.fetchConstants(['actions']);
        this.constants = this.serverConstants.data;
    }

    submit() {
        let promise;
        if (this.newsletterBoth) {
            this.models.action = "Newsletter - Physical";
            promise = this.tasksService.postBulkAddTask(this.models, this.selectedContacts).then(() => {
                this.models.action = "Newsletter - Email";
                return this.tasksService.postBulkAddTask(this.models, this.selectedContacts);
            });
        } else if (this.newsletterPhysical) {
            this.models.action = "Newsletter - Physical";
            promise = this.tasksService.postBulkAddTask(this.models, this.selectedContacts);
        } else if (this.newsletterEmail) {
            this.models.action = "Newsletter - Email";
            promise = this.tasksService.postBulkAddTask(this.models, this.selectedContacts);
        } else {
            promise = this.tasksService.postBulkAddTask(this.models, this.selectedContacts);
        }
        return promise.then(() => {
            this.contacts.load(true);
            this.contactsTags.load();
            this.$scope.$hide();
        });
    }
}
export default angular.module('mpdx.tasks.add.controller', [])
    .controller('addTaskController', AddTaskController).name;
