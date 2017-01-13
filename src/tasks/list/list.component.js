import moment from 'moment';

class ListController {
    contact;
    modal;
    moment;
    tasksService;

    constructor(tasksService, modal) {
        this.modal = modal;
        this.moment = moment;
        this.tasksService = tasksService;

        this.models = {};
        this.selected = [];
    }
    openCompleteTaskModal(task) {
        this.modal.open({
            template: require('../../contacts/show/completeTask/completeTask.html'),
            controller: 'completeTaskController',
            locals: {
                task: task,
                contact: task.contacts[0],
                taskAction: task.activity_type,
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
                taskIds: this.selected,
                modalCallback: () => this.loadPage()
            }
        });
    }
    deleteComment(taskId, commentId) {
        this.tasksService.deleteComment(taskId, commentId).then(this.load);
    }
    bulkDeleteTasks() {
        this.tasksService.bulkDeleteTasks(this.selected);
    }
    bulkCompleteTasks() {
        this.tasksService.bulkCompleteTasks(this.selected);
    }
    toggleSelected(taskId) {
        const index = this.selected.indexOf(taskId);
        if (index >= 0) {
            this.selected.splice(index, 1);
        } else {
            this.selected.push(taskId);
        }
    }
    toggleAll() {
        const tasks = this.tasksService.data[this.key];
        if (tasks.length === this.selected.length) {
            this.selected = [];
        } else {
            this.selected = tasks.map((task) => task.id);
        }
    }
    newComment(task) {
        if (this.models.comment) {
            this.tasksService.submitNewComment(task, this.models.comment).then(function() {
                this.load();
            }.bind(this));
            this.models.comment = '';
        }
    }
    deleteTask(taskId) {
        this.tasksService.deleteTask(taskId).then(function cb(status) {
            if (status) {
                this.load();
            }
        }.bind(this));
    }
    onPageChange(pageNum) {
        this.tasksService.meta[this.key].pagination.page = pageNum;
        this.load();
    }
    starTask(task) {
        this.tasksService.starTask(task, this.loadPage);
    }
    $onChanges() {
        this.tasksService.meta[this.key].pagination.page = 1;
        this.load();
    }
    load() {
        this.tasksService.fetchTasks(this.key);
    }
    loadPage() {
        this.tasksService.fetchTasksForPage(
            this.parentComponent
        );
    }
}

const Tasks = {
    controller: ListController,
    template: require('./list.html'),
    bindings: {
        contact: '<',
        filters: '<',
        tags: '<',
        key: '<',
        title: '<',
        color: '<',
        sortkey: '<',
        parentComponent: '<'
    }
};

export default angular.module('mpdx.tasks.list.component', [])
    .component('tasksList', Tasks).name;
