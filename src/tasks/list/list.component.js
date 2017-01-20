import moment from 'moment';

class ListController {
    alerts;
    modal;
    moment;
    tasksService;

    constructor(
        alerts, tasksService, modal
    ) {
        this.alerts = alerts;
        this.modal = modal;
        this.moment = moment;
        this.tasksService = tasksService;

        this.models = {};
        this.selected = [];
    }
    $onChanges(changes) {
        if (changes.changed) {
            this.tasksService.meta[this.key].pagination.page = 1;
            this.load();
        }
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
        this.alerts.addAlert('This functionality is not yet available on MPDX NEXT', 'danger'); //Needs bulk save
        // this.modal.open({
        //     template: require('../bulkEdit/bulkEdit.html'),
        //     controller: 'bulkEditTaskController',
        //     locals: {
        //         taskIds: this.selected,
        //         modalCallback: () => this.loadPage()
        //     }
        // });
    }
    bulkDeleteTasks() {
        this.alerts.addAlert('This functionality is not yet available on MPDX NEXT', 'danger'); //Needs bulk save
        // this.tasksService.bulkDeleteTasks(this.selected);
    }
    bulkCompleteTasks() {
        // this.alerts.addAlert('This functionality is not yet available on MPDX NEXT', 'danger'); //Needs bulk save
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
        if (this.selected.length === tasks.length) {
            this.selected = [];
        } else {
            this.selected = tasks.map((task) => task.id);
        }
    }
    newComment(task) {
        if (this.models.comment) {
            this.tasksService.submitNewComment(task, this.models.comment).then((data) => {
                task.updated_in_db_at = data.updated_in_db_at;
                task.comments.push(this.models.comment);
                this.models.comment = '';
            });
        }
    }
    deleteTask(taskId) {
        this.tasksService.deleteTask(taskId).then(() => {
            this.tasksService.data[this.key] = _.reject(this.tasksService.data[this.key], {id: taskId});
        });
    }
    onPageChange(pageNum) {
        this.tasksService.meta[this.key].pagination.page = pageNum;
        this.load();
    }
    starTask(task) {
        return this.tasksService.starTask(task).then((data) => {
            task.starred = data.starred;
            task.updated_in_db_at = data.updated_in_db_at;
        });
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
