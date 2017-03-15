import moment from 'moment';

class ListController {
    alerts;
    modal;
    moment;
    tasks;

    constructor(
        alerts, contacts, modal, tasks
    ) {
        this.alerts = alerts;
        this.contacts = contacts;
        this.modal = modal;
        this.moment = moment;
        this.tasks = tasks;

        this.models = {};
        this.selected = [];
    }
    $onChanges(changes) {
        if (changes.changed) {
            this.tasks.meta[this.key].pagination.page = 1;
            this.load();
        }
    }
    openCompleteTaskModal(task) {
        this.modal.open({
            template: require('../complete/complete.html'),
            controller: 'completeTaskController',
            locals: {
                task: task,
                contact: task.contacts[0],
                modalCallback: () => this.loadPage()
            }
        });
    }
    openEditTaskModal(task) {
        this.modal.open({
            template: require('../edit/edit.html'),
            controller: 'editTaskController',
            locals: {
                selectedContacts: task.contacts,
                specifiedTask: task,
                ajaxAction: 'put',
                toComplete: false,
                createNext: false,
                modalCallback: () => this.loadPage()
            }
        });
    }
    openBulkEditTaskModal() {
        this.modal.open({
            template: require('../bulkEdit/bulkEdit.html'),
            controller: 'bulkEditTaskController',
            locals: {
                selectedTasks: this.selected,
                modalCallback: () => this.loadPage()
            }
        });
    }
    bulkDeleteTasks() {
        this.tasks.bulkDeleteTasks(this.selected).then(() => {
            this.loadPage();
        });
    }
    bulkCompleteTasks() {
        this.tasks.bulkCompleteTasks(this.selected).then(() => {
            this.loadPage();
        });
    }
    toggleSelected(task) {
        const index = _.findIndex(this.selected, { id: task.id });
        if (index >= 0) {
            this.selected.splice(index, 1);
        } else {
            this.selected.push(task);
        }
    }
    toggleAll() {
        const tasks = this.tasks.data[this.key];
        if (this.selected.length === tasks.length) {
            this.selected = [];
        } else {
            this.selected = tasks;
        }
    }
    newComment(task) {
        if (this.models.comment) {
            this.tasks.addComment(task, this.models.comment).then((data) => {
                task.comments.push(data);
                this.models.comment = '';
            });
        }
    }
    deleteTask(taskId) {
        this.tasks.deleteTask(taskId).then(() => {
            this.tasks.data[this.key] = _.reject(this.tasks.data[this.key], {id: taskId});
        });
    }
    onPageChange(pageNum) {
        this.tasks.meta[this.key].pagination.page = pageNum;
        this.load();
    }
    starTask(task) {
        return this.tasks.starTask(task).then((data) => {
            task.starred = data.starred;
            task.updated_in_db_at = data.updated_in_db_at;
        });
    }
    load() {
        this.tasks.fetchTasks(this.key);
    }
    loadPage() {
        this.tasks.fetchTasksForPage(
            this.parentComponent
        );
    }
}

const Tasks = {
    controller: ListController,
    template: require('./list.html'),
    bindings: {
        changed: '<',
        tags: '<',
        key: '@',
        title: '@',
        color: '@',
        sortKey: '@',
        parentComponent: '<'
    }
};

export default angular.module('mpdx.tasks.list.component', [])
    .component('tasksList', Tasks).name;
