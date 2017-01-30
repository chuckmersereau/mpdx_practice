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
        if (_.get(changesObj, 'contact.currentValue.id', false)) {
            this.load();
        }
    }
    load() {
        this.tasksService.fetchUncompletedTasks(this.contact.id);
    }
    newComment(task) {
        if (this.models.comment) {
            this.tasksService.submitNewComment(task, this.models.comment).then(() => {
                this.load();
            });
            this.models.comment = '';
        }
    }
    deleteTask(taskId) {
        this.tasksService.deleteTask(taskId).then(() => {
            this.load();
        });
    }
    starTask(task) {
        return this.tasksService.starTask(task).then((data) => {
            task.starred = data.starred;
            task.updated_in_db_at = data.updated_in_db_at;
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
