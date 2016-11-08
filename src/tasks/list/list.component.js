import moment from 'moment';

class ListController {
    constructor($rootScope, tasksService, $modal) {
        this.moment = moment;
        this.models = {};
        this.tasks = tasksService.data;
        this.meta = tasksService.meta[this.key];
        this.defaultFilters = tasksService.defaultFilters[this.key];
        this.tasksService = tasksService;
        this.selected = [];
        this.combinedFilters = Object.assign(
            {
                tags: this.tags ? this.tags : [],
                contact_ids: this.contact ? [this.contact.id] : []
            },
            this.filters
        );

        // this.openCompleteTaskModal = function(task) {
        //     $modal({
        //         templateUrl: '/templates/modal.html',
        //         contentTemplate: '/templates/common/complete_task.html',
        //         animation: 'am-fade-and-scale',
        //         placement: 'center',
        //         controller: 'completeTaskController',
        //         controllerAs: 'vm',
        //         locals: {
        //             taskId: task.id,
        //             contact: vm.contact,
        //             taskAction: task.activity_type,
        //             modalCallback: this.loadPage
        //         }
        //     });
        // };
        //
        // this.openEditTaskModal = function(task) {
        //     $modal({
        //         templateUrl: '/templates/modal.html',
        //         contentTemplate: '/templates/common/bulk_log_task.html',
        //         animation: 'am-fade-and-scale',
        //         placement: 'center',
        //         controller: 'bulkLogTaskController',
        //         locals: {
        //             modalTitle: 'Edit Task',
        //             contacts: [vm.contact],
        //             specifiedTask: task,
        //             ajaxAction: 'put',
        //             toComplete: this.completed,
        //             createNext: false,
        //             modalCallback: this.loadPage
        //         },
        //         controllerAs: 'vm'
        //     });
        // };
    }

    toggleSelected(taskId) {
        var index = this.selected.indexOf(taskId);
        if (index >= 0) {
            this.selected.splice(index, 1);
        } else {
            this.selected.push(taskId);
        }
    };

    newComment(taskId) {
        if (this.models.comment) {
            this.tasksService.submitNewComment(taskId, this.models.comment, function() {
                this.load();
            }.bind(this));
            this.models.comment = '';
        }
    };

    deleteTask(taskId) {
        this.tasksService.deleteTask(taskId, this.load);
    };

    onPageChange(pageNum) {
        this.meta.page = pageNum;
        this.load();
    };

    starTask(task) {
        this.tasksService.starTask(task, this.loadPage);
    };

    $onChanges(changes) {
        if (this.setCombinedFilters(changes)) {
            console.log('to load...');
            this.load();
        }
    }

    setCombinedFilters(changes) {
        console.log(changes);
        var newTags, newContactId, newFilters;
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
};

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
        page: '<'
    }
};

export default angular.module('mpdx.tasks.list.component', [])
    .component('tasksList', Tasks).name;
