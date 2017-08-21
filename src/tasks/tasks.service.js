
import uuid from 'uuid/v1';
import concat from 'lodash/fp/concat';
import defaultTo from 'lodash/fp/defaultTo';
import assign from 'lodash/fp/assign';
import each from 'lodash/fp/each';
import find from 'lodash/fp/find';
import get from 'lodash/fp/get';
import includes from 'lodash/fp/includes';
import isEmpty from 'lodash/fp/isEmpty';
import isNil from 'lodash/fp/isNil';
import map from 'lodash/fp/map';
import omitBy from 'lodash/fp/omitBy';
import pull from 'lodash/fp/pull';
import pullAllBy from 'lodash/fp/pullAllBy';
import reject from 'lodash/fp/reject';
import joinComma from '../common/fp/joinComma';
import union from 'lodash/fp/union';
import unionBy from 'lodash/fp/unionBy';
import relationshipId from '../common/fp/relationshipId';
import emptyToNull from '../common/fp/emptyToNull';
import upsert from '../common/fp/upsert';
import reduce from 'lodash/fp/reduce';
import moment from 'moment';

class TasksService {
    constructor(
        $rootScope, $log, gettextCatalog,
        alerts, api, contacts, modal, serverConstants, tasksFilter, tasksModals, tasksTags, users
    ) {
        this.$log = $log;
        this.$rootScope = $rootScope;
        this.alerts = alerts;
        this.api = api;
        this.contacts = contacts;
        this.gettextCatalog = gettextCatalog;
        this.modal = modal;
        this.serverConstants = serverConstants;
        this.tasksFilter = tasksFilter;
        this.tasksModals = tasksModals;
        this.tasksTags = tasksTags;
        this.users = users;

        this.analytics = null;
        this.completeList = [];
        this.data = [];
        this.dataLoadCount = 0;
        this.meta = {};
        this.page = 1;
        this.selected = [];
        this.loading = true; // TODO: maybe should become false until actually loading
        // TODO: move to component (won't update in service)
        this.categories = {
            'completed': this.gettextCatalog.getString('Completed'),
            'today': this.gettextCatalog.getString('Today'),
            'overdue': this.gettextCatalog.getString('Overdue'),
            'upcoming': this.gettextCatalog.getString('Upcoming'),
            'no-due-date': this.gettextCatalog.getString('No Due Date')
        };
    }
    reset() {
        this.selected = [];
        this.change();
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
    getAnalytics() {
        return this.api.get('tasks/analytics', { filter: { account_list_id: this.api.account_list_id } }).then((data) => {
            /* istanbul ignore next */
            this.$log.debug('tasks/analytics', data);
            this.analytics = data;
            return this.analytics;
        });
    }
    load(page = 1) {
        const reset = page === 1;
        this.loading = true;

        let currentCount;

        if (reset) {
            this.page = 1;
            this.meta = {};
            this.data = [];
            this.dataLoadCount++;
            currentCount = angular.copy(this.dataLoadCount);
        }

        return this.api.get({
            url: 'tasks',
            data: {
                filter: this.tasksFilter.toParams(),
                page: page,
                per_page: 25,
                include: 'activity_contacts,activity_contacts.contact',
                fields: {
                    activity_contacts: 'contact',
                    contact: 'name',
                    tasks: 'activity_contacts,activity_type,completed,completed_at,no_date,starred,start_at,subject,tag_list,comments_count,location,result,notification_type,notification_time_before,notification_time_unit'
                }
            },
            deSerializationOptions: relationshipId('comments'), // for comment count
            overrideGetAsPost: true
        }).then((data) => {
            /* istanbul ignore next */
            this.$log.debug('tasks page ' + data.meta.pagination.page, data);
            /* istanbul ignore next */
            if (reset && currentCount !== this.dataLoadCount) { // case for slow prior query returning after faster newer query
                return;
            }
            this.loading = false;
            this.meta = data.meta;
            const tasks = map((task) => this.process(task), data);
            this.data = unionBy('id', this.data, tasks);
            this.page = parseInt(this.meta.pagination.page);
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
    loadMoreTasks() {
        return this.canLoadMoreTasks() ? this.load(this.page + 1) : null;
    }
    canLoadMoreTasks() {
        return !this.loading && this.page < parseInt(this.meta.pagination.total_pages);
    }
    save(task, comment = null) {
        task = this.mutateTagList(task);
        task = this.mutateComment(task, comment);

        return this.api.put(`tasks/${task.id}`, task).then(() => {
            this.change();
        });
    }
    mutateTagList(task) {
        // fix for api mis-match
        return task.tag_list ? assign(task, {
            tag_list: joinComma(task.tag_list)
        }) : task;
    }
    mutateComment(task, comment) {
        return comment ? assign(task, {
            comments: concat(defaultTo([], task.comments), {
                id: uuid(),
                body: comment,
                person: { id: this.users.current.id }
            })
        }) : task;
    }
    change() {
        this.$rootScope.$emit('taskChange');
    }
    create(task, contactIds = [], comment) {
        task.account_list = { id: this.api.account_list_id };
        contactIds = reject('', contactIds);
        task = this.mutateTagList(task);
        if (contactIds.length > 1) {
            const tasks = reduce((result, contactId) => {
                let contactTask = angular.copy(task);
                contactTask = this.mutateComment(contactTask, comment);
                if (!isEmpty(contactId)) {
                    result = concat(result, assign(contactTask, { id: uuid(), contacts: [{ id: contactId }] }));
                }
                return result;
            }, [], contactIds);
            return this.api.post({ url: 'tasks/bulk', data: tasks, type: 'tasks' }).then(() => {
                if (contactIds.length > 0) {
                    this.$rootScope.$emit('contactCreated');
                }
            });
        }
        task = this.mutateComment(task, comment);

        task.contacts = map((contactId) => { return { id: contactId }; }, contactIds);
        return this.api.post('tasks', task).then((data) => {
            const processedTask = this.process(data);
            this.data = upsert('id', processedTask, this.data);
            return data;
        });
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
    bulkEdit(model, comment, tags) {
        const tasks = map((id) => {
            let task = assign({ id: id }, model);
            if (comment) {
                task.comments = [{ id: uuid(), body: comment, person: { id: this.users.current.id } }];
            }
            task.tag_list = emptyToNull(joinComma(tags));
            return omitBy(isNil, task);
        }, this.selected);
        return this.api.put('tasks/bulk', tasks).then((data) => {
            this.tasksTags.change();
            this.change();
            return data;
        });
    }
    deleteComment(task, comment) {
        return this.api.delete(`tasks/${task.id}/comments/${comment.id}`).then(() => {
            task.comments = reject({ id: comment.id }, task.comments);
        });
    }
    delete(task) {
        const message = this.gettextCatalog.getString('Are you sure you wish to delete the selected task?');
        return this.modal.confirm(message).then(() => {
            return this.api.delete(`tasks/${task.id}`).then(() => {
                this.data = reject({ id: task.id }, this.data);
                this.selected = pull(task.id, this.selected);
            });
        });
    }
    bulkDelete() {
        if (this.selected.length > 150) {
            const message = this.gettextCatalog.getString('Too many tasks selected, please select a maximum of 150 tasks.');
            this.alerts.addAlert(message, 'danger');
            return Promise.reject(new Error({ message: message }));
        }
        const tasks = map((id) => { return { id: id }; }, this.selected);
        const message = this.gettextCatalog.getPlural(this.selected.length, 'Are you sure you wish to delete the selected task?', 'Are you sure you wish to delete the {{$count}} selected tasks?', {});
        return this.modal.confirm(message).then(() => {
            return this.api.delete({ url: 'tasks/bulk', data: tasks, type: 'tasks' }).then(() => {
                this.alerts.addAlert(this.gettextCatalog.getPlural(angular.copy(this.selected).length, '1 task successfully removed.', '{{$count}} tasks successfully removed.', {}));
                this.data = pullAllBy('id', tasks, this.data);
                if (this.data.length === 0) {
                    this.load();
                }
                this.selected = [];
            }).catch((err) => {
                this.alerts.addAlert(this.gettextCatalog.getPlural(this.selected.length, 'Unable to delete the selected task.', 'Unable to delete the {{$count}} selected tasks.', {}), 'danger');
                throw err;
            });
        });
    }
    star(task) {
        return this.api.put(`tasks/${task.id}`, { id: task.id, starred: !task.starred });
    }
    isSelected(id) {
        return includes(id, this.selected);
    }
    select(id) {
        if (includes(id, this.selected)) {
            this.selected = pull(id, this.selected);
        } else {
            this.selected = union(this.selected, [id]);
        }
    }
    clearSelected() {
        this.selected = [];
    }
    selectAll(all = true) {
        if (all) {
            this.getList(true).then(() => {
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
    addModal(contactsList = [], activityType = null) {
        return this.tasksModals.add(contactsList, activityType).then(() => {
            this.change();
        });
    }
    newsletterModal() {
        return this.tasksModals.newsletter().then(() => {
            this.change();
        });
    }
    logModal(contactsList = []) {
        return this.modal.open({
            template: require('./modals/log/log.html'),
            controller: 'logTaskController',
            resolve: {
                tags: () => this.tasksTags.load(),
                0: () => this.serverConstants.load(['activity_hashes', 'next_actions', 'results', 'status_hashes'])
            },
            locals: {
                contactsList: contactsList
            }
        });
    }
    bulkEditModal(tasks) {
        return this.tasksModals.bulkEdit(tasks || this.selected);
    }
    editModal(task) {
        return this.tasksModals.edit(task);
    }
    completeModal(task) {
        return this.tasksModals.complete(task);
    }
}

import alerts from '../common/alerts/alerts.service';
import api from '../common/api/api.service';
import contacts from '../contacts/contacts.service';
import getText from 'angular-gettext';
import serverConstants from 'common/serverConstants/serverConstants.service';
import tasksModals from './modals/modals.service';
import tasksFilter from './filter/filter.service';
import tasksTags from './filter/tags/tags.service';
import users from '../common/users/users.service';

export default angular.module('mpdx.tasks.service', [
    getText,
    alerts, api, contacts, serverConstants, tasksFilter, tasksModals, tasksTags, users
]).service('tasks', TasksService).name;
