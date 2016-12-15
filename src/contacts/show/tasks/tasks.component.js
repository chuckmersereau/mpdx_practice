class ContactTasksController {
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
    }
    $onChanges(changesObj) {
        if (_.has(changesObj.contact, 'currentValue.id') && changesObj.contact.currentValue.id !== changesObj.contact.previousValue.id) {
            this.load(changesObj.contact.currentValue.id);
        }
    }
    load(id) {
        this.tasksService.fetchUncompletedTasks(id);
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
        this.tasksService.deleteTask(taskId).then(this.load.bind(this, this.contact.id));
    }
    starTask(task) {
        this.tasksService.starTask(task).then(() => {
            task.starred = !task.starred;
        });
    }
    openCompleteTaskModal(task) {
        this.modal.open({
            template: require('../completeTask/completeTask.html'),
            controller: 'completeTaskController',
            locals: {
                taskId: task.id,
                contact: this.contact,
                taskAction: task.activity_type
            },
            onHide: this.load.bind(this, this.contact.id)
        });
    }
    openEditTaskModal(task) {
        var contactId = this.contact.id;
        this.modal.open({
            template: require('../../logTask/logTask.html'),
            controller: 'logTaskController',
            locals: {
                modalTitle: 'Edit Task',
                selectedContacts: [contactId],
                specifiedTask: task,
                ajaxAction: 'put',
                toComplete: false,
                createNext: false
            },
            onHide: this.load.bind(this, this.contact.id)
        });
    }
}

const Tasks = {
    controller: ContactTasksController,
    template: require('./tasks.html'),
    bindings: {
        contact: '<'
    }
};

export default angular.module('mpdx.contacts.show.tasks.component', [])
    .component('contactTasks', Tasks).name;
