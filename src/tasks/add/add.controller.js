class AddTaskController {
    contacts;
    contactsService;
    serverConstants;
    tagsService;
    tasksService;

    constructor(
        $scope,
        tagsService, serverConstants, tasksService, contactsService,
        contacts, specifiedAction, specifiedSubject, modalTitle
    ) {
        this.$scope = $scope;
        this.contacts = contacts;
        this.contactsService = contactsService;
        this.serverConstants = serverConstants;
        this.specifiedAction = specifiedAction;
        this.specifiedSubject = specifiedSubject;
        this.tagsService = tagsService;
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
        this.tasksService.postBulkAddTask(this.models, this.contacts).then(() => {
            this.contactsService.load(true);
            this.tagsService.load();
            this.$scope.$hide();
        });
    }
}
export default angular.module('mpdx.tasks.add.controller', [])
    .controller('addTaskController', AddTaskController).name;
