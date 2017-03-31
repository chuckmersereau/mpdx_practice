import uuid from 'uuid/v1';
import concat from 'lodash/fp/concat';
import assign from 'lodash/fp/assign';
import each from 'lodash/fp/each';
import find from 'lodash/fp/find';
import includes from 'lodash/fp/includes';
import isEmpty from 'lodash/fp/isEmpty';
import map from 'lodash/fp/map';
import pull from 'lodash/fp/pull';
const reduce = require('lodash/fp/reduce').convert({ 'cap': false });
import reject from 'lodash/fp/reject';
import joinComma from '../common/fp/joinComma';
import union from 'lodash/fp/union';
import unionBy from 'lodash/fp/unionBy';
import relationshipId from '../common/fp/relationshipId';

class TasksService {
    contacts;
    selectedContacts;
    constructor(
        $rootScope, $window, $log, $q, gettextCatalog, api, tasksFilter, tasksTags, users, modal, tasksModals
    ) {
        this.moment = $window.moment;
        this.$log = $log;
        this.$q = $q;
        this.api = api;
        this.gettextCatalog = gettextCatalog;
        this.tasksFilter = tasksFilter;
        this.tasksTags = tasksTags;
        this.users = users;
        this.modal = modal;
        this.tasksModals = tasksModals;

        this.analytics = null;
        this.completeList = [];
        this.data = [];
        this.meta = {};
        this.page = 1;
        this.selected = [];
        this.categories = {
            'completed': this.gettextCatalog.getString('Completed'),
            'today': this.gettextCatalog.getString('Today'),
            'overdue': this.gettextCatalog.getString('Overdue'),
            'upcoming': this.gettextCatalog.getString('Upcoming'),
            'no-due-date': this.gettextCatalog.getString('No Due Date')
        };

        $rootScope.$on('taskFilterChange', () => {
            $log.debug('tasks service: filter change');
            this.getList(true);
            this.getAnalytics(true);
            this.load(true);
        });

        $rootScope.$on('tasksTagsChanged', (event, filters) => {
            $log.debug('tasks service: tag change', filters);
            this.getList(true);
            this.getAnalytics(true);
            this.load(true);
        });

        $rootScope.$on('accountListUpdated', () => {
            this.getList(true);
            this.getAnalytics(true);
            this.load(true);
        });

        this.getList(true);
        this.load(true);
    }
    get(id, updateLists = true) {
        return this.api.get(`tasks/${id}`, {
            include: 'comments,comments.person,contacts',
            fields: {
                contacts: 'addresses,name,square_avatar',
                person: 'first_name,last_name'
            }
        }).then((task) => {
            if (updateLists) {
                this.data = unionBy('id', [this.process(task)], this.data);
                const listTask = {id: task.id, subject: task.subject, updated_in_db_at: task.updated_in_db_at};
                this.completeList = unionBy('id', [listTask], this.completeList);
            }
            return task;
        });
    }
    getList(reset = false) {
        if (!reset && this.completeList) {
            return this.$q.resolve(this.completeList);
        }
        this.completeList = [];
        return this.api.get('tasks', {
            filter: this.tasksFilter.toParams(),
            fields: {
                tasks: 'subject,updated_in_db_at'
            },
            per_page: 25000,
            overrideGetAsPost: true
        }).then((data) => {
            this.$log.debug('tasks all', data);
            this.completeList = data;
        });
    }
    getAnalytics(reset = false) {
        if (this.analytics && !reset) {
            return this.$q.resolve(this.analytics);
        }
        return this.api.get('tasks/analytics', {filter: {account_list_id: this.api.account_list_id}}).then((data) => {
            this.$log.debug('tasks/analytics', data);
            this.analytics = data;
            return this.analytics;
        });
    }
    load(reset = false, page = 0) {
        this.loading = true;

        if (!reset && page <= this.page) {
            this.loading = false;
            return this.$q.resolve(this.data);
        }

        if (reset) {
            this.page = 0;
            this.meta = {};
            this.data = [];
        }

        return this.api.get({
            url: 'tasks',
            data: {
                filter: this.tasksFilter.toParams(),
                page: page,
                per_page: 25,
                include: 'contacts',
                fields: {
                    tasks: 'activity_type,comments,completed,contacts,no_date,starred,start_at,subject,tag_list,updated_in_db_at',
                    contacts: 'name',
                    comments: ''
                }
            },
            deSerializationOptions: relationshipId('comments'), //for comment count
            overrideGetAsPost: true
        }).then((data) => {
            this.$log.debug('tasks page ' + data.meta.pagination.page, data);
            this.loading = false;
            this.meta = data.meta;
            const tasks = map((task) => this.process(task), data);
            this.data = unionBy('id', tasks, this.data);
            this.page = parseInt(this.meta.pagination.page);
        });
    }
    process(task) {
        const startAt = this.moment(task.start_at);
        if (task.completed) {
            task.category = { name: 'completed', id: 4 };
        } else if (this.moment().isSame(startAt, 'day')) {
            task.category = { name: 'today', id: 1 };
        } else if (this.moment().isAfter(startAt, 'day')) {
            task.category = { name: 'overdue', id: 0 };
        } else if (this.moment().isBefore(startAt, 'day')) {
            task.category = { name: 'upcoming', id: 2 };
        } else {
            task.category = { name: 'no-due-date', id: 3 };
        }
        return task;
    }
    loadMoreTasks() {
        if (this.loading || this.page >= parseInt(this.meta.pagination.total_pages)) {
            return;
        }
        this.load(false, this.page + 1);
    }
    save(task, comment = null) {
        task.tag_list = joinComma(task.tag_list); //fix for api mis-match
        if (comment) {
            if (!task.comments) {
                task.comments = [];
            }
            task.comments.push({id: uuid(), body: comment, person: { id: this.users.current.id }});
        }
        return this.api.put(`tasks/${task.id}`, task).then(() => {
            this.tasksTags.load();
            this.get(task.id);
        });
    }
    create(task, contactIds = []) {
        task.account_list = { id: this.api.account_list_id };
        contactIds = reject('', contactIds);
        task.tag_list = joinComma(task.tag_list); //fix for api mis-match
        if (contactIds.length > 1) {
            const tasks = reduce((result, contactId) => {
                if (!isEmpty(contactId)) {
                    result.push(assign(task, {id: uuid(), contacts: [{id: contactId}]}));
                }
                return result;
            }, [], contactIds);
            return this.api.post({ url: 'tasks/bulk', data: tasks, type: 'tasks' }).then(() => {
                if (this.selectedContacts.length > 0) {
                    this.contacts.load(true);
                }
            });
        }
        task.contacts = map(contactId => { return {id: contactId}; }, contactIds);
        return this.api.post('tasks', task).then((data) => {
            return this.get(data.id);
        });
    }
    bulkComplete() {
        const tasks = map((task) => {
            task.completed = true;
            return task;
        }, this.getSelected());
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
    bulkEdit(model, comment) {
        const tasks = reduce((result, task) => {
            if (comment) {
                if (!task.comments) {
                    task.comments = [];
                }
                task.comments.push({id: uuid(), body: comment, person: { id: this.users.current.id }});
            }
            task.tag_list = joinComma(task.tag_list); //fix for api mis-match
            task = assign(task, model);
            result.push(task);
            return result;
        }, [], this.getSelected());
        return this.api.put('tasks/bulk', tasks);
    }
    bulkLog(ajaxAction, taskId, model, contactIds, toComplete) {
        let url = 'tasks';
        if (taskId) {
            url += `/${taskId}`;
        }
        model.account_list = { id: this.api.account_list_id };
        model.completed = toComplete || model.result !== null;
        if (model.tag_list) {
            model.tag_list = joinComma(model.tag_list); //fix for api mis-match
        }

        if (contactIds.length > 1) {
            const tasks = reduce((result, contactId) => {
                if (!isEmpty(contactId)) {
                    result.push(assign(model, {id: uuid(), contacts: [{id: contactId}]}));
                }
                return result;
            }, [], contactIds);
            return this.api.post({ url: 'tasks/bulk', data: tasks, type: 'tasks' });
        }

        model.contacts = map(contactId => {
            return {id: contactId};
        }, contactIds);
        return this.api.call({
            method: ajaxAction,
            url: url,
            data: model
        });
    }
    addComment(task, comment) {
        return this.api.post(`tasks/${task.id}/comments`, { body: comment, person: { id: this.users.current.id } }).then((data) => {
            data.person = {
                id: this.users.current.id,
                first_name: this.users.current.first_name,
                last_name: this.users.current.last_name
            };
            task.comments = concat(task.comments, data);
        });
    }
    deleteComment(task, comment) {
        return this.api.delete(`tasks/${task.id}/comments/${comment.id}`).then(() => {
            task.comments = reject({id: comment.id}, task.comments);
        });
    }
    delete(task) {
        const message = this.gettextCatalog.getString('Are you sure you wish to delete the selected task?');
        return this.modal.confirm(message).then(() => {
            return this.api.delete(`tasks/${task.id}`, {id: task.id}).then(() => {
                this.completeList = reject({id: task.id}, this.completeList);
                this.data = reject({id: task.id}, this.data);
                this.selected = pull(task.id, this.selected);
            });
        });
    }
    bulkDelete() {
        const message = this.gettextCatalog.getString('Are you sure you wish to delete the selected tasks?');
        return this.modal.confirm(message).then(() => {
            const selected = this.getSelected();
            return this.api.delete({url: 'tasks/bulk', data: selected, type: 'tasks'}).then(() => {
                each((task) => {
                    this.data = reject({id: task.id}, this.data);
                    this.completeList = reject({id: task.id}, this.completeList);
                    this.selected = pull(task.id, this.selected);
                }, selected);
            });
        });
    }
    star(task) {
        return this.api.put(`tasks/${task.id}`, {id: task.id, updated_in_db_at: task.updated_in_db_at, starred: !task.starred});
    }
    getSelected() {
        return reduce((result, task) => {
            if (includes(task.id, this.selected)) {
                result.push({id: task.id, updated_in_db_at: task.updated_in_db_at});
            }
            return result;
        }, [], this.completeList);
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
            this.selected = map('id', this.completeList);
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
    addModal(contactsList = []) {
        return this.tasksModals.add(contactsList);
    }
    newsletterModal() {
        return this.tasksModals.newsletter();
    }
    logModal(contactsList = []) {
        return this.tasksModals.log(contactsList);
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

export default angular.module('mpdx.tasks.service', [])
    .service('tasks', TasksService).name;
