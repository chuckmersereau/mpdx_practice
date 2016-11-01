import moment from 'moment';

class ListController {
    constructor($rootScope, tasksService) {
        console.log(tasksService);
        var vm = this;
        this.moment = moment;
        this.models = {};
        this.tasks = tasksService.data;
        this.meta = tasksService.meta[this.key];
        this.star = tasksService.starTask;
        this.delete = tasksService.deleteTask;
        this.addComment = tasksService.submitNewComment;
        this.selected = [];
        this.combinedFilters = Object.assign(
            {
                tags: this.tags ? this.tags : [],
                contact_ids: this.contact ? [this.contact.id] : []
            },
            this.filters
        );

        this.$onChanges = function(changes) {
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
            if (newTags || newContactId || newFilters) {
                Object.assign(
                    this.combinedFilters, {
                        tags: newTags || this.tags,
                        contact_ids: newContactId ? [newContactId] : [this.contact ? this.contact.id : ''],
                        filters: newFilters || this.filters
                    }
                );

                console.log(changes);
                this.load = tasksService.fetchTasks.bind(
                    this,
                    this.key,
                    this.combinedFilters
                );
                this.loadPage = tasksService.fetchTasksForPage.bind(
                    this,
                    this.page,
                    this.combinedFilters
                );
                this.load();
            }
        };

        this.onPageChange = function(pageNum) {
            this.meta.page = pageNum;
            this.load();
        };

        this.newComment = function(taskId) {
            if (this.models.comment) {
                this.addComment(taskId, this.models.comment, function() {
                    this.load();
                }.bind(this));
                this.models.comment = '';
            }
        };

        this.deleteTask = function(taskId) {
            this.delete(taskId, vm.load);
        };

        this.starTask = function(task) {
            this.star(task, vm.loadPage);
        };

        this.toggleSelected = function(taskId) {
            var index = vm.selected.indexOf(taskId);
            if (index >= 0) {
                vm.selected.splice(index, 1);
            } else {
                vm.selected.push(taskId);
            }
        };

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
};

const Tasks = {
    controller: ListController,
    controllerAs: 'vm',
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
