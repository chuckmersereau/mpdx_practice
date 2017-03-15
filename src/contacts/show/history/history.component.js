import moment from 'moment';

class ContactHistoryController {
    contact;
    modal;
    moment;
    tasks;
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
        if (changesObj.contact) {
            if (changesObj.contact.currentValue.id !== changesObj.contact.previousValue.id) {
                this.load(changesObj.contact.currentValue.id);
            }
        }
    }
    load(id) {
        this.tasks.fetchCompletedTasks(id);
    }
    newComment(task) {
        if (this.models.comment) {
            this.tasks.addComment(task, this.models.comment).then(() => {
                this.load(this.contact.id);
            });
            this.models.comment = '';
        }
    }
    deleteTask(taskId) {
        this.tasks.deleteTask(taskId).then(this.load.bind(this));
    }
    openEditTaskModal(task) {
        var contactId = this.contact.id;
        this.modal.open({
            template: require('../../../tasks/log/log.html'),
            locals: {
                modalTitle: 'Edit Task',
                selectedContacts: [contactId],
                specifiedTask: task,
                ajaxAction: 'put',
                toComplete: true,
                createNext: false
            },
            onHide: () => this.load(this.contact.id)
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
