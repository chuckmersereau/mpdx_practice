class ContactTasksController {
    contact;
    modal;
    tasks;

    constructor(
        modal, tasks
    ) {
        this.modal = modal;
        this.moment = moment;
        this.tasks = tasks;
        this.models = {};
    }
    $onChanges(changesObj) {
        if (_.get(changesObj, 'contact.currentValue.id', false)) {
            this.load();
        }
    }
    load() {
        this.tasks.fetchUncompletedTasks(this.contact.id);
    }
    newComment(task) {
        if (this.models.comment) {
            this.tasks.addComment(task, this.models.comment).then(() => {
                this.load();
            });
            this.models.comment = '';
        }
    }
    deleteTask(taskId) {
        this.tasks.deleteTask(taskId).then(() => {
            this.load();
        });
    }
    starTask(task) {
        return this.tasks.starTask(task).then((data) => {
            task.starred = data.starred;
            task.updated_in_db_at = data.updated_in_db_at;
        });
    }
    openCompleteTaskModal(task) {
        this.modal.open({
            template: require('../../../tasks/complete/complete.html'),
            controller: 'completeTaskController',
            locals: {
                task: task,
                contact: this.contact
            },
            onHide: () => this.load()
        });
    }
    openEditTaskModal(task) {
        const contactId = this.contact.id;
        this.modal.open({
            template: require('../../../tasks/log/log.html'),
            controller: 'logTaskController',
            locals: {
                modalTitle: 'Edit Task',
                selectedContacts: [contactId],
                specifiedTask: task,
                ajaxAction: 'put',
                toComplete: false,
                createNext: false
            },
            onHide: () => this.load()
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
