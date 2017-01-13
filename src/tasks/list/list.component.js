import moment from 'moment';

class ListController {
    contact;
    modal;
    tasks;
    tasksService;

    constructor(tasksService, tasksFilterService, modal) {
        this.moment = moment;
        this.models = {};
        this.tasks = tasksService.data;
        this.meta = tasksService.meta[this.key];
        this.defaultFilters = tasksService.defaultFilters[this.key];
        this.tasksService = tasksService;
        this.modal = modal;
        this.selected = [];
        this.combinedFilters = Object.assign(
            {
                tags: this.tags ? this.tags : [],
                contact_ids: this.contact ? [this.contact.id] : []
            },
            this.filters
        );
    }
    openCompleteTaskModal(task) {
        this.modal.open({
            template: require('../../contacts/show/completeTask/completeTask.html'),
            controller: 'completeTaskController',
            locals: {
                task: task,
                contact: task.contacts[0],
                taskAction: task.activity_type,
                modalCallback: this.loadPage
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
                modalCallback: this.loadPage
            }
        });
    }
    openBulkEditTaskModal() {
        this.modal.open({
            template: require('../bulkEdit/bulkEdit.html'),
            controller: 'bulkEditTaskController',
            locals: {
                taskIds: this.selected,
                modalCallback: this.loadPage
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
        let tasks = this.tasks[this.key];
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
        this.meta.page = pageNum;
        this.load();
    }
    starTask(task) {
        this.tasksService.starTask(task, this.loadPage);
    }
    $onChanges(changes) {
        if (this.setCombinedFilters(changes)) {
            this.load();
        }
    }
    setCombinedFilters(changes) {
        let newTags, newContactId, newFilters;
        if (changes.tags) {
            if (changes.tags.currentValue) {
                newTags = changes.tags.currentValue;
            }
        }
        if (changes.contact) {
            if (changes.contact.currentValue) {
                if (changes.contact.currentValue.id) {
                    newContactId = changes.contact.currentValue.id;
                }
            }
        }
        if (changes.filters) {
            if (!_.isEmpty(_.xor(changes.filters.previousValue, changes.filters.currentValue)).length) {
                newFilters = changes.filters.currentValue;
            }
        }
        if (newTags || newContactId || newFilters || changes.key.isFirstChange()) {
            Object.assign(
                this.combinedFilters, {
                    tags: newTags || this.tags,
                    contact_ids: newContactId ? [newContactId] : [this.contact ? this.contact.id : ''],
                    filters: newFilters || this.filters
                }
            );
            return true;
        }
        return false;
    }
    load() {
        this.tasksService.fetchTasks(
            this.key,
            this.combinedFilters
        );
    }
    loadPage() {
        this.tasksService.fetchTasksForPage(
            this.page,
            this.combinedFilters
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
        page: '<'
    }
};

export default angular.module('mpdx.tasks.list.component', [])
    .component('tasksList', Tasks).name;
