import uuid from 'uuid/v1';
import concat from 'lodash/fp/concat';
import assign from 'lodash/fp/assign';
import defaultTo from 'lodash/fp/defaultTo';
import each from 'lodash/fp/each';
import find from 'lodash/fp/find';
import includes from 'lodash/fp/includes';
import isEmpty from 'lodash/fp/isEmpty';
import map from 'lodash/fp/map';
import pull from 'lodash/fp/pull';
import pullAllBy from 'lodash/fp/pullAllBy';
import reject from 'lodash/fp/reject';
import joinComma from '../common/fp/joinComma';
import union from 'lodash/fp/union';
import unionBy from 'lodash/fp/unionBy';
import relationshipId from '../common/fp/relationshipId';
import upsert from '../common/fp/upsert';
const reduce = require('lodash/fp/reduce').convert({ 'cap': false });

class TasksService {
    contacts;
    selectedContacts;
    constructor(
        $rootScope, $window, $log, $q, gettextCatalog,
        alerts, api, tasksFilter, tasksTags, users, modal, tasksModals, contacts
    ) {
        this.alerts = alerts;
        this.moment = $window.moment;
        this.$log = $log;
        this.$q = $q;
        this.$rootScope = $rootScope;
        this.api = api;
        this.gettextCatalog = gettextCatalog;
        this.tasksFilter = tasksFilter;
        this.tasksTags = tasksTags;
        this.users = users;
        this.contacts = contacts;
        this.modal = modal;
        this.tasksModals = tasksModals;

        this.analytics = null;
        this.completeList = [];
        this.data = [];
        this.meta = {};
        this.page = 1;
        this.selected = [];
        this.loading = true;
        this.categories = {
            'completed': this.gettextCatalog.getString('Completed'),
            'today': this.gettextCatalog.getString('Today'),
            'overdue': this.gettextCatalog.getString('Overdue'),
            'upcoming': this.gettextCatalog.getString('Upcoming'),
            'no-due-date': this.gettextCatalog.getString('No Due Date')
        };

        this.dataLoadCount = 0;

        $rootScope.$on('tasksFilterChange', () => {
            this.reset();
        });

        $rootScope.$on('tasksTagsChanged', () => {
            this.reset();
        });

        $rootScope.$on('accountListUpdated', () => {
            this.reset();
        });
    }
    reset() {
        this.selected = [];
        this.change();
    }
    get(id, updateLists = true) {
        return this.api.get(`tasks/${id}`, {
            include: 'comments,comments.person,contacts,contacts.addresses,contacts.people,contacts.people.facebook_accounts,contacts.people.phone_numbers,contacts.people.email_addresses',
            fields: {
                contacts: 'addresses,name,status,square_avatar,send_newsletter,pledge_currency_symbol,pledge_frequency,pledge_received,uncompleted_tasks_count,tag_list,pledge_amount,people',
                people: 'deceased,email_addresses,facebook_accounts,first_name,last_name,phone_numbers',
                addresses: 'city,historic,primary_mailing_address,postal_code,state,source,street',
                email_addresses: 'email,historic,primary',
                phone_numbers: 'historic,location,number,primary',
                facebook_accounts: 'username',
                person: 'first_name,last_name'
            }
        }).then((task) => {
            const processedTask = this.process(task);
            if (updateLists) {
                this.data = upsert('id', processedTask, this.data);
            }
            this.$log.debug(`tasks/${task.id}`, processedTask);
            return processedTask;
        });
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
            this.$log.debug('tasks all', data);
            this.completeList = data;
        });
    }
    getAnalytics() {
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

        let currentCount;
        this.dataLoadCount++;
        currentCount = angular.copy(this.dataLoadCount);

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
                    tasks: 'activity_type,completed,completed_at,contacts,no_date,starred,start_at,subject,tag_list,comments_count',
                    contacts: 'name'
                }
            },
            deSerializationOptions: relationshipId('comments'), //for comment count
            overrideGetAsPost: true
        }).then((data) => {
            this.$log.debug('tasks page ' + data.meta.pagination.page, data);
            if (reset && currentCount !== this.dataLoadCount) {
                return;
            }
            this.loading = false;
            this.meta = data.meta;
            const tasks = map((task) => this.process(task), data);
            this.data = unionBy('id', this.data, tasks);
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
            this.change();
        });
    }
    change() {
        this.$rootScope.$emit('taskChange');
    }
    create(task, contactIds = [], comment) {
        task.account_list = { id: this.api.account_list_id };
        contactIds = reject('', contactIds);
        task.tag_list = joinComma(task.tag_list); //fix for api mis-match
        if (contactIds.length > 1) {
            const tasks = reduce((result, contactId) => {
                let contactTask = angular.copy(task);
                if (comment) {
                    if (!contactTask.comments) {
                        contactTask.comments = [];
                    }
                    contactTask.comments.push({id: uuid(), body: comment, person: { id: this.users.current.id }});
                }
                if (!isEmpty(contactId)) {
                    result.push(assign(contactTask, {id: uuid(), contacts: [{id: contactId}]}));
                }
                return result;
            }, [], contactIds);
            return this.api.post({ url: 'tasks/bulk', data: tasks, type: 'tasks' }).then(() => {
                if (contactIds.length > 0) {
                    this.$rootScope.$emit('contactCreated');
                }
            });
        }
        if (comment) {
            if (!task.comments) {
                task.comments = [];
            }
            task.comments.push({id: uuid(), body: comment, person: { id: this.users.current.id }});
        }
        task.contacts = map(contactId => { return {id: contactId}; }, contactIds);
        return this.api.post('tasks', task).then((data) => {
            return this.get(data.id);
        });
    }
    bulkComplete() {
        const tasks = map(id => {
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
        const tasks = map(id => {
            let task = {id: id};
            if (comment) {
                task.comments = concat(defaultTo([], task.comments), {id: uuid(), body: comment, person: { id: this.users.current.id }});
            }
            task = assign(task, model);
            if (tags.length > 0) {
                task.tag_list = joinComma(tags);
            }
            return task;
        }, this.selected);
        return this.api.put('tasks/bulk', tasks).then((data) => {
            this.tasksTags.change();
            this.change();
            return data;
        });
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
            return this.api.delete(`tasks/${task.id}`).then(() => {
                this.data = reject({id: task.id}, this.data);
                this.selected = pull(task.id, this.selected);
            });
        });
    }
    bulkDelete() {
        if (this.selected.length > 25) {
            this.alerts.addAlert(this.gettextCatalog.getString('Too many tasks selected, please select a maximum of 25 tasks.'), 'danger');
            return this.$q.reject();
        }
        const tasks = map(id => { return {id: id}; }, this.selected);
        const message = this.gettextCatalog.getPlural(this.selected.length, 'Are you sure you wish to delete the selected task?', 'Are you sure you wish to delete the {{$count}} selected tasks?', {});
        return this.modal.confirm(message).then(() => {
            return this.api.delete({url: 'tasks/bulk', data: tasks, type: 'tasks'}).then(() => {
                this.alerts.addAlert(this.gettextCatalog.getPlural(angular.copy(this.selected).length, '1 task successfully removed.', '{{$count}} tasks successfully removed.', {}));
                this.data = pullAllBy('id', tasks, this.data);
                this.selected = [];
            }).catch(() => {
                this.alerts.addAlert(this.gettextCatalog.getPlural(this.selected.length, 'Unable to delete the selected task.', 'Unable to delete the {{$count}} selected tasks.', {}), 'danger');
            });
        });
    }
    star(task) {
        return this.api.put(`tasks/${task.id}`, {id: task.id, starred: !task.starred});
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
