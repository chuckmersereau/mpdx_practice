import {
    concat,
    defaultTo,
    each,
    find,
    findIndex,
    get,
    includes,
    map,
    pull,
    pullAllBy,
    reduce,
    reject,
    sortBy,
    union
} from 'lodash/fp';
import moment from 'moment';
import pagination from 'common/pagination/pagination';
import relationshipId from 'common/fp/relationshipId';
import upsert from 'common/fp/upsert';

export const defaultMeta = {
    pagination: {
        total_count: 0
    }
};

class ListController {
    constructor(
        $log, $rootScope, gettextCatalog,
        alerts, api, modal, session, tasks, tasksFilter, tasksModals, tasksTags, users
    ) {
        this.$log = $log;
        this.$rootScope = $rootScope;
        this.alerts = alerts;
        this.api = api;
        this.gettextCatalog = gettextCatalog;
        this.pagination = pagination;
        this.modal = modal;
        this.session = session;
        this.tasks = tasks;
        this.tasksFilter = tasksFilter;
        this.tasksModals = tasksModals;
        this.tasksTags = tasksTags;

        this.data = [];
        this.dataLoadCount = 0;
        this.loading = false;
        this.meta = defaultMeta;
        this.page = 1;
        this.selected = [];
        this.totalTaskCount = 0;
        this.pageSize = defaultTo(25, users.getCurrentOptionValue('page_size_tasks'));
    }
    $onInit() {
        this.categories = {
            'completed': this.gettextCatalog.getString('Completed'),
            'today': this.gettextCatalog.getString('Today'),
            'overdue': this.gettextCatalog.getString('Overdue'),
            'upcoming': this.gettextCatalog.getString('Upcoming'),
            'no-due-date': this.gettextCatalog.getString('No Due Date')
        };

        this.watcher = this.$rootScope.$on('taskChange', () => {
            this.load();
        });

        this.watcher2 = this.$rootScope.$on('tasksFilterChange', () => {
            this.load();
        });

        this.watcher3 = this.$rootScope.$on('tasksTagsChanged', () => {
            this.reset();
        });
        this.watcher4 = this.$rootScope.$on('taskCreated', (e, task) => {
            const processedTask = this.process(task);
            this.data = upsert('id', processedTask, this.data);
            this.load(this.page);
            this.totalTaskCount++;
            this.meta.pagination.total_count++;
        });
        this.watcher5 = this.$rootScope.$on('taskDeleted', (e, id) => {
            this.data = reject({ id: id }, this.data);
            this.selected = pull(id, this.selected);
            this.totalTaskCount--;
            this.meta.pagination.total_count--;
        });
        this.watcher6 = this.$rootScope.$on('tasksDeleted', (e, tasks) => {
            this.data = pullAllBy('id', tasks, this.data);
            this.load(this.page);
            this.selected = [];
            this.totalTaskCount -= tasks.length;
            this.meta.pagination.total_count -= tasks.length;
        });

        this.watcher7 = this.$rootScope.$on('accountListUpdated', () => {
            this.tasksFilter.reset();
            this.tasksFilter.load(true);
            this.tasksTags.load(true);
            this.selectedTask = null;
            this.reset();
        });

        this.watcher8 = this.$rootScope.$on('taskCommentsChanged', (e, task) => {
            const existingTask = find({ id: task.id }, this.data);
            existingTask.comments = map('id', task.comments);
        });

        this.load();
    }
    $onDestroy() {
        this.watcher();
        this.watcher2();
        this.watcher3();
        this.watcher4();
        this.watcher5();
        this.watcher6();
        this.watcher7();
        this.watcher8();
    }
    $onChanges() {
        this.reset();
    }
    openRemoveTagModal() {
        this.modal.open({
            template: require('../modals/removeTags/removeTags.html'),
            controller: 'removeTaskTagController',
            locals: {
                selectedTasks: this.getSelectedTasks(),
                currentListSize: this.data.length
            }
        });
    }
    getSelectedTasks() {
        if (this.selected.length > this.data.length) {
            return map((id) => {
                return { id: id };
            }, this.selected);
        }
        return reduce((result, task) => {
            if (includes(task.id, this.selected)) {
                result = concat(result, task);
            }
            return result;
        }, [], this.data);
    }
    load(page = 1) {
        this.loading = true;
        this.meta = defaultMeta;
        this.data = [];
        this.dataLoadCount++;
        let currentCount = angular.copy(this.dataLoadCount);

        return this.api.get({
            url: 'tasks',
            data: {
                filter: this.tasksFilter.toParams(),
                page: page,
                per_page: this.pageSize,
                include: 'activity_contacts,activity_contacts.contact',
                fields: {
                    activity_contacts: 'contact',
                    contact: 'name',
                    tasks: 'activity_contacts,activity_type,completed,completed_at,no_date,contacts,starred,start_at,'
                    + 'subject,tag_list,comments_count,location,result,notification_type,notification_time_before,'
                    + 'notification_time_unit'
                }
            },
            deSerializationOptions: relationshipId('comments'), // for comment count
            overrideGetAsPost: true
        }).then((data) => {
            /* istanbul ignore next */
            this.$log.debug('tasks page ' + data.meta.pagination.page, data);

            /* istanbul ignore next */
            if (currentCount !== this.dataLoadCount) { // case for slow prior query returning after faster newer query
                return;
            }
            this.meta = data.meta;
            if (data.length === 0) {
                this.getTotalCount();
                this.loading = false;
                return;
            }
            const tasks = map((task) => this.process(task), data);
            this.data = sortBy(
                ['category.id', 'completed', '-completed_at', 'start_at', 'created_at']
                , tasks);
            this.page = parseInt(this.meta.pagination.page);
            this.loading = false;
            return this.data;
        });
    }
    /* eslint-disable complexity */
    process(task) {
        const startAt = moment(task.start_at);
        if (task.completed) {
            task.category = { name: 'completed', id: 4 };
        } else if (!get('start_at', task)) {
            task.category = { name: 'no-due-date', id: 3 };
        } else if (moment().isSame(startAt, 'day')) {
            task.category = { name: 'today', id: 1 };
        } else if (moment().isAfter(startAt, 'day')) {
            task.category = { name: 'overdue', id: 0 };
        } else if (moment().isBefore(startAt, 'day')) {
            task.category = { name: 'upcoming', id: 2 };
        }
        return task;
    }
    /* eslint-enable */
    getTotalCount() { // only used when search is empty
        return this.api.get('tasks', {
            filter: {
                account_list_id: this.api.account_list_id
            },
            per_page: 0
        }).then((data) => {
            this.totalTaskCount = data.meta.pagination.total_count;
        });
    }
    clearSelected() {
        this.selected = [];
    }
    isSelected(id) {
        return includes(id, this.selected);
    }
    select(id) {
        this.selected = includes(id, this.selected)
            ? pull(id, this.selected)
            : union(this.selected, [id]);
        this.lastSelectedIndex = findIndex({ id: id }, this.data);
    }
    multiSelect(id) {
        const lastSelectedIndex = defaultTo(0, this.lastSelectedIndex);
        const index = findIndex({ id: id }, this.data);
        const items = lastSelectedIndex < index
            ? this.data.slice(lastSelectedIndex, index + 1)
            : this.data.slice(index, lastSelectedIndex);
        const ids = map('id', items);
        this.selected = union(this.selected, ids);
        this.lastSelectedIndex = index;
    }
    selectAll(all = true) {
        if (all) {
            return this.getList(true).then(() => {
                this.selected = map('id', this.completeList);
            });
        } else {
            this.selected = map('id', this.data);
        }
    }
    toggleAll() {
        if (this.selected.length < this.data.length) {
            this.selectAll(false);
        } else {
            this.clearSelected();
        }
    }
    getList() {
        this.completeList = [];
        return this.api.get({
            url: 'tasks',
            data: {
                filter: this.tasksFilter.toParams(),
                fields: {
                    tasks: 'subject'
                },
                per_page: 25000
            },
            overrideGetAsPost: true
        }).then((data) => {
            /* istanbul ignore next */
            this.$log.debug('tasks all', data);
            this.completeList = data;
        });
    }
    reset() {
        this.selected = [];
        this.$rootScope.$emit('taskChange');
    }
    bulkComplete() {
        const tasks = map((id) => {
            return {
                id: id,
                completed: true
            };
        }, this.selected);
        return this.api.put('tasks/bulk', tasks).then(() => {
            each((selectedTask) => {
                let task = find({ id: selectedTask.id }, this.data);
                if (task) {
                    task.completed = true;
                    task.category = 'completed';
                }
            }, tasks);
        });
    }
    bulkDelete(selected) {
        if (selected.length > 150) {
            const message = this.gettextCatalog.getString('Too many tasks selected, please select a maximum of 150 tasks.');
            this.alerts.addAlert(message, 'danger');
            return Promise.reject(new Error({ message: message }));
        }
        const tasks = map((id) => { return { id: id }; }, selected);
        const message = this.gettextCatalog.getPlural(selected.length,
            'Are you sure you wish to delete the selected task?',
            'Are you sure you wish to delete the {{$count}} selected tasks?',
            {}
        );
        return this.modal.confirm(message).then(() => {
            const successMessage = this.gettextCatalog.getPlural(selected.length,
                '1 task successfully removed.',
                '{{$count}} tasks successfully removed.',
                {}
            );
            const errorMessage = this.gettextCatalog.getPlural(selected.length,
                'Unable to delete the selected task.',
                'Unable to delete the {{$count}} selected tasks.',
                {}
            );
            return this.api.delete({
                url: 'tasks/bulk',
                data: tasks,
                type: 'tasks',
                autoParams: false,
                successMessage: successMessage,
                errorMessage: errorMessage
            }).then(() => {
                this.$rootScope.$emit('tasksDeleted', tasks);
            });
        });
    }
    onOpen(task, action) {
        this.selectedTask = angular.copy(task);
        this.drawerView = action;
    }
    onClose() {
        this.selectedTask = null;
    }
    pageSizeChange(size) {
        this.pageSize = size;
        this.load(1);
    }
    openAddTagModal(selectedTaskIds) {
        return this.modal.open({
            template: require('../filter/tags/add/add.html'),
            controller: 'addTaskTagController',
            locals: {
                selectedTasks: selectedTaskIds
            }
        });
    }
}

const TaskList = {
    controller: ListController,
    template: require('./list.html'),
    bindings: {
        contact: '<'
    }
};

import alerts from 'common/alerts/alerts.service';
import gettextCatalog from 'angular-gettext';
import modal from 'common/modal/modal.service';
import session from 'common/session/session.service';
import tasks from '../tasks.service';
import tasksFilter from '../filter/filter.service';
import tasksModals from '../modals/modals.service';
import tasksTags from '../filter/tags/tags.service';
import users from 'common/users/users.service';

export default angular.module('mpdx.tasks.list.component', [
    gettextCatalog,
    alerts, modal, session, tasks, tasksFilter, tasksModals, tasksTags, users
]).component('tasksList', TaskList).name;
