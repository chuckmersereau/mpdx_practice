class AddTaskController {
    selectedContacts;
    contacts;
    contactsTags;
    serverConstants;
    tasksService;

    constructor(
        $scope, gettextCatalog,
        tasksTags, serverConstants, tasksService, contacts,
        selectedContacts, specifiedAction, specifiedSubject, modalTitle
    ) {
        this.$scope = $scope;
        this.gettextCatalog = gettextCatalog;
        this.selectedContacts = selectedContacts;
        this.contacts = contacts;
        this.tasksTags = tasksTags;
        this.serverConstants = serverConstants;
        this.specifiedAction = specifiedAction;
        this.specifiedSubject = specifiedSubject;
        this.tasksService = tasksService;

        this.modalTitle = modalTitle;

        this.models = {
            start_at: moment().toISOString(),
            no_date: false,
            activity_type: this.specifiedAction,
            subject: this.specifiedSubject,
            tag_list: [],
            comments: []
        };

        // this.serverConstants.fetchConstants(['actions']);
        this.constants = this.serverConstants.data;
        this.emailNotification = false;
    }

    save() {
        if (this.comment) {
            this.models.comments.push({body: this.comment});
        }
        if (this.emailNotification) {
            this.models.notification_type = 'email';
        }
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

    translate(str) {
        return this.gettextCatalog.getString(str);
    }
}
export default angular.module('mpdx.tasks.add.controller', [])
    .controller('addTaskController', AddTaskController).name;
