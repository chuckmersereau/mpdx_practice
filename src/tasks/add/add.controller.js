class AddTaskController {
    contacts;
    contactsService;
    contactsTags;
    serverConstants;
    tasksService;

    constructor(
        $scope,
        contactsTags, serverConstants, tasksService, contactsService,
        contacts, specifiedAction, specifiedSubject, modalTitle
    ) {
        this.$scope = $scope;
        this.contacts = contacts;
        this.contactsService = contactsService;
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
            promise = this.tasksService.postBulkAddTask(this.models, this.contacts).then(() => {
                this.models.action = "Newsletter - Email";
                return this.tasksService.postBulkAddTask(this.models, this.contacts);
            });
        } else if (this.newsletterPhysical) {
            this.models.action = "Newsletter - Physical";
            promise = this.tasksService.postBulkAddTask(this.models, this.contacts);
        } else if (this.newsletterEmail) {
            this.models.action = "Newsletter - Email";
            promise = this.tasksService.postBulkAddTask(this.models, this.contacts);
        } else {
            promise = this.tasksService.postBulkAddTask(this.models, this.contacts);
        }
        return promise.then(() => {
            this.contactsService.load(true);
            this.contactsTags.load();
            this.$scope.$hide();
        });
    }
}
export default angular.module('mpdx.tasks.add.controller', [])
    .controller('addTaskController', AddTaskController).name;
