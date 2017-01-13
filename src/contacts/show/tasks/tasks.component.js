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
        this.uncompletedTasks = [];
    }
    $onChanges(changesObj) {
        if (_.has(changesObj.contact, 'currentValue.id') && changesObj.contact.currentValue.id !== changesObj.contact.previousValue.id) {
            this.load();
        }
    }
    load() {
        this.tasksService.fetchUncompletedTasks(this.contact.id).then((tasks) => {
            this.uncompletedTasks = tasks;
        });
    }
    newComment(taskId) {
        if (this.models.comment) {
            this.tasksService.submitNewComment(taskId, this.models.comment).then(() => {
                this.load();
            });
            this.models.comment = '';
        }
    }
    deleteTask(taskId) {
        this.tasksService.deleteTask(taskId).then(this.load.bind(this));
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
                task: task,
                contact: this.contact,
                taskAction: task.activity_type
            },
            onHide: this.load
        });
    }
    openEditTaskModal(task) {
        const contactId = this.contact.id;
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
            onHide: this.load
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
