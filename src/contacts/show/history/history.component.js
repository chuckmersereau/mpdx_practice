class ContactHistoryController {
    contact;
    modal;
    tasksService;

    constructor(
        modal, tasksService
    ) {
        this.modal = modal;
        this.moment = moment;
        this.tasksService = tasksService;

        this.models = {};

        this.tasks = tasksService.data;
    }
    $onChanges(changesObj) {
        if (changesObj.contact) {
            if (changesObj.contact.currentValue.id !== changesObj.contact.previousValue.id) {
                this.load(changesObj.contact.currentValue.id);
            }
        }
    }
    load(id) {
        this.tasksService.fetchCompletedTasks(id);
    }
    newComment(taskId) {
        if (this.models.comment) {
            this.tasksService.submitNewComment(taskId, this.models.comment).then(() => {
                this.load(this.contact.id);
            });
            this.models.comment = '';
        }
    }
    deleteTask(taskId) {
        this.tasksService.deleteTask(taskId).then(this.load.bind(this));
    }
    openEditTaskModal(task) {
        var contactId = this.contact.id;
        this.modal.open({
            template: require('../../logTask/logTask.html'),
            locals: {
                modalTitle: 'Edit Task',
                selectedContacts: [contactId],
                specifiedTask: task,
                ajaxAction: 'put',
                toComplete: true,
                createNext: false
            },
            onHide: this.load.bind(this, this.contact.id)
        });
    }
}

const History = {
    controller: ContactHistoryController,
    template: require('./history.html'),
    bindings: {
        contact: '<'
    }
};

export default angular.module('mpdx.contacts.show.history.component', [])
    .component('contactHistory', History).name;
