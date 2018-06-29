import 'angular-gettext';
import * as moment from 'moment';
import { ApiService } from '../../common/api/api.service';
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
    union
} from 'lodash/fp';
import alerts, { AlertsService } from '../../common/alerts/alerts.service';
import modal, { ModalService } from '../../common/modal/modal.service';
import pagination from '../../common/pagination/pagination';
import relationshipId from '../../common/fp/relationshipId';
import session, { SessionService } from '../../common/session/session.service';
import tasks, { TasksService } from '../tasks.service';
import tasksFilter, { TasksFilterService } from '../filter/filter.service';
import tasksModals, { TasksModalsService } from '../modals/modals.service';
import tasksTags, { TasksTagsService } from '../filter/tags/tags.service';
import upsert from '../../common/fp/upsert';
import users, { UsersService } from '../../common/users/users.service';

export const defaultMeta = {
    pagination: {
        total_count: 0
    }
};

class ListController {
    categories: any;
    completeList: any;
    data: any;
    dataLoadCount: number;
    drawerView: any;
    lastSelectedIndex: number;
    loading: boolean;
    meta: any;
    page: number;
    pageSize: number;
    pagination: pagination;
    selected: string[];
    selectedTask: any;
    totalTaskCount: number;
    watcher: () => void;
    watcher2: () => void;
    watcher3: () => void;
    watcher4: () => void;
    watcher5: () => void;
    watcher6: () => void;
    watcher7: () => void;
    watcher8: () => void;
    watcher9: () => void;
    constructor(
        private $log: ng.ILogService,
        private $q: ng.IQService,
        private $rootScope: ng.IRootScopeService,
        private gettextCatalog: ng.gettext.gettextCatalog,
        private alerts: AlertsService,
        private api: ApiService,
        private modal: ModalService,
        private session: SessionService,
        private tasks: TasksService,
        private tasksFilter: TasksFilterService,
        private tasksModals: TasksModalsService,
        private tasksTags: TasksTagsService,
        private users: UsersService
    ) {
        this.data = [];
        this.dataLoadCount = 0;
        this.loading = false;
        this.meta = defaultMeta;
        this.page = 1;
        this.pagination = pagination;
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
            'no-date': this.gettextCatalog.getString('No Due Date')
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
            const existingTask: any = find({ id: task.id }, this.data);
            existingTask.comments = map('id', task.comments);
        });

        this.watcher9 = this.$rootScope.$on('taskCompleted', (e, taskId) => {
            if (taskId === this.selectedTask.id) {
                this.selectedTask = null;
            }
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
        this.watcher9();
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
        }).then((data: any) => {
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
            this.data = map((task) => this.process(task), data);
            this.page = parseInt(this.meta.pagination.page);
            this.loading = false;
            return this.data;
        });
    }
    /* eslint-disable complexity */
    private process(task) {
        const startAt = moment(task.start_at);
        if (task.completed) {
            task.category = 'completed';
        } else if (!get('start_at', task)) {
            task.category = 'no-date';
        } else if (moment().isSame(startAt, 'day')) {
            task.category = 'today';
        } else if (moment().isAfter(startAt, 'day')) {
            task.category = 'overdue';
        } else if (moment().isBefore(startAt, 'day')) {
            task.category = 'upcoming';
        }
        return task;
    }
    /* eslint-enable */
    private getTotalCount() { // only used when search is empty
        return this.api.get('tasks', {
            filter: {
                account_list_id: this.api.account_list_id
            },
            per_page: 0
        }).then((data: any) => {
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
            return this.getList().then(() => {
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
                let task: any = find({ id: selectedTask.id }, this.data);
                if (task) {
                    task.completed = true;
                    task.category = 'completed';
                }
                this.$rootScope.$emit('taskCompleted', selectedTask.id);
            }, tasks);
        });
    }
    bulkDelete(selected) {
        if (selected.length > 150) {
            const message = this.gettextCatalog.getString('Too many tasks selected, please select a maximum of 150 tasks.');
            this.alerts.addAlert(message, 'danger');
            return this.$q.reject(message);
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
        this.$rootScope.$emit('taskDrawerOpened');
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
        contact: '<',
        inDrawer: '<'
    }
};

export default angular.module('mpdx.tasks.list.component', [
    'gettext',
    alerts, modal, session, tasks, tasksFilter, tasksModals, tasksTags, users
]).component('tasksList', TaskList).name;
