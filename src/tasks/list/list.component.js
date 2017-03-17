import moment from 'moment';
import concat from 'lodash/fp/concat';
import findIndex from 'lodash/fp/findIndex';
import reject from 'lodash/fp/reject';

class ListController {
    alerts;
    modal;
    moment;
    tasks;
    users;

    constructor(
        gettextCatalog,
        alerts, contacts, modal, tasks, users
    ) {
        this.alerts = alerts;
        this.contacts = contacts;
        this.gettextCatalog = gettextCatalog;
        this.modal = modal;
        this.moment = moment;
        this.tasks = tasks;
        this.users = users;

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
        const message = this.gettextCatalog.getString('Are you sure you wish to delete the selected tasks?');
        this.modal.confirm(message).then(() => {
            this.tasks.bulkDeleteTasks(this.selected).then(() => {
                this.loadPage();
            });
        });
    }
    bulkCompleteTasks() {
        this.tasks.bulkCompleteTasks(this.selected).then(() => {
            this.loadPage();
        });
    }
    toggleSelected(task) {
        const index = findIndex({ id: task.id }, this.selected);
        if (index > -1) {
            this.selected.splice(index, 1);
        } else {
            this.selected.push(task);
        }
    }
    isSelected(task) {
        return findIndex({id: task.id}, this.selected) > -1;
    }
    toggleAll(all = false) {
        const tasks = this.tasks.data[this.key];
        if (all) {
            this.selected = this.tasks.completeList[this.key];
        } else {
            if (this.selected.length >= tasks.length) {
                this.selected = [];
            } else {
                this.selected = tasks;
            }
        }
    }
    newComment(task) {
        if (this.models.comment) {
            this.tasks.addComment(task, this.models.comment).then((data) => {
                //assign person name since we only provide id
                data.person = {
                    first_name: this.users.current.first_name,
                    last_name: this.users.current.last_name
                };
                task.comments = concat(data, task.comments);
                this.models.comment = '';
            });
        }
    }
    deleteComment(...params) {
        const message = this.gettextCatalog.getString('Are you sure you wish to delete the selected comment?');
        this.modal.confirm(message).then(() => {
            this.tasks.deleteComment(...params);
        });
    }
    deleteTask(taskId) {
        const message = this.gettextCatalog.getString('Are you sure you wish to delete the selected task?');
        this.modal.confirm(message).then(() => {
            this.tasks.deleteTask(taskId).then(() => {
                this.tasks.data[this.key] = reject({id: taskId}, this.tasks.data[this.key]);
            });
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
        this.tasks.getList(this.key, true);
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
