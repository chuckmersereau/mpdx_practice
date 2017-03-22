import uuid from 'uuid/v1';
import assign from "lodash/fp/assign";
import each from "lodash/fp/each";
import isEmpty from "lodash/fp/isEmpty";
import map from "lodash/fp/map";
import noop from "lodash/fp/noop";
import reduce from "lodash/fp/reduce";
import reject from "lodash/fp/reject";
import joinComma from "../common/fp/joinComma";

class TasksService {
    api;
    modal;
    tasksFilter;
    tasksTags;
    users;

    constructor(
        $log, $q, gettextCatalog,
        modal, api, tasksFilter, tasksTags, users
    ) {
        this.$log = $log;
        this.$q = $q;
        this.modal = modal;
        this.api = api;
        this.gettextCatalog = gettextCatalog;
        this.tasksFilter = tasksFilter;
        this.tasksTags = tasksTags;
        this.users = users;

        this.analytics = null;
        this.data = {};
        this.sort = 'all';
        this.completeList = {};

        this.init();
    }
    init() {
        this.pages = {
            contactShow: ['completed', 'uncompleted'],
            tasksList: ['today', 'overdue', 'upcoming', 'tomorrow', 'noDueDate', 'starred', 'allCompleted']
        };
        const DEFAULT_PAGINATION = {
            pagination: {
                page: 1,
                per_page: 10
            },
            sort: 'start_at'
        };

        this.meta = {
            completed: assign(DEFAULT_PAGINATION, {
                sort: '-no_date,start_at'
            }),
            uncompleted: assign(DEFAULT_PAGINATION, {
                sort: '-no_date,start_at'
            }),
            today: DEFAULT_PAGINATION,
            overdue: DEFAULT_PAGINATION,
            upcoming: DEFAULT_PAGINATION,
            tomorrow: DEFAULT_PAGINATION,
            noDueDate: DEFAULT_PAGINATION,
            starred: DEFAULT_PAGINATION,
            allCompleted: DEFAULT_PAGINATION
        };
        this.defaultFilters = {
            completed: {
                completed: true
            },
            uncompleted: {
                completed: false
            },
            today: {
                completed: false,
                no_date: false,
                date_range: 'today'
            },
            overdue: {
                completed: false,
                no_date: false,
                date_range: 'overdue'
            },
            upcoming: {
                completed: false,
                no_date: false,
                date_range: 'upcoming'
            },
            tomorrow: {
                completed: false,
                no_date: false,
                date_range: 'tomorrow'
            },
            noDueDate: {
                completed: false,
                no_date: true,
                date_range: 'no_date'
            },
            starred: {
                starred: true,
                completed: false
            },
            allCompleted: {
                completed: true
            }
        };
    }
    buildFilterParams(collection) {
        const defaultFilters = this.defaultFilters[collection];
        const wildcardSearch = this.tasksFilter.wildcard_search;
        let filters = assign(defaultFilters, this.tasksFilter.params);
        if (wildcardSearch) {
            filters.wildcard_search = wildcardSearch;
        }
        if (this.tasksTags.selectedTags.length > 0) {
            filters.tags = joinComma(map('name', this.tasksTags.selectedTags));
        } else {
            delete filters.tags;
        }
        if (this.tasksTags.rejectedTags.length > 0) {
            filters.exclude_tags = joinComma(map('name', this.tasksTags.rejectedTags));
        } else {
            delete filters.exclude_tags;
        }
        filters.account_list_id = this.api.account_list_id;
        filters.any_tags = this.tasksTags.anyTags;
        return filters;
    }
    getList(collection, reset = false) {
        if (!reset && this.completeList[collection]) {
            return this.$q.resolve(this.completeList);
        }
        this.completeList[collection] = []; // to avoid double call
        return this.api.get('tasks', {
            filter: this.buildFilterParams(collection),
            fields: {
                tasks: 'subject'
            },
            per_page: 25000,
            sort: this.meta[collection].pagination.order
        }).then((data) => {
            this.$log.debug('tasks all', data);
            this.completeList[collection] = data;
        });
    }
    fetchTasks(collection) {
        this.data[collection] = null;

        return this.api.get({
            url: 'tasks',
            data: {
                filters: this.buildFilterParams(collection),
                include: 'comments,comments.person,contacts,contacts.people,contacts.addresses,contacts.people.email_addresses,contacts.people.phone_numbers,contacts.people.facebook_accounts',
                fields: {
                    contacts: 'addresses,name,people,square_avatar',
                    addresses: 'city,primary_mailing_address,postal_code,state,street',
                    people: 'avatar,email_addresses,facebook_accounts,first_name,last_name,phone_numbers',
                    person: 'first_name,last_name',
                    email_addresses: 'email,historic,primary',
                    phone_numbers: 'historic,location,number,primary',
                    facebook_accounts: 'username'
                },
                page: this.meta[collection].pagination.page,
                per_page: this.meta[collection].pagination.per_page,
                sort: this.meta[collection].pagination.order
            },
            overrideGetAsPost: true
        }).then((data) => {
            this.$log.debug(`${collection} tasks page ${data.meta.pagination.page}`, data);
            this.data[collection] = data;
            this.meta[collection] = data.meta;
            return data;
        });
    }
    fetchUncompletedTasks(id) {
        return this.api.get({
            url: 'tasks',
            data: {
                filters: {
                    completed: false,
                    contact_ids: [id]
                },
                page: 1,
                per_page: 500,
                include: 'comments',
                sort: 'start_at'
            },
            overrideGetAsPost: true
        }).then((data) => {
            this.uncompleted = data;
            return data;
        });
    }
    fetchCompletedTasks(id) {
        return this.api.get({
            url: 'tasks',
            data: {
                filters: {
                    completed: true,
                    contact_ids: [id]
                },
                include: 'comments',
                page: 1,
                per_page: 500,
                sort: 'completed_at'
            },
            overrideGetAsPost: true
        }).then((data) => {
            this.completed = data;
            return data;
        });
    }
    fetchTasksForPage(page) {
        each(collection => {
            this.fetchTasks(collection);
        }, this.pages[page]);
    }
    save(task) {
        task.tag_list = joinComma(task.tag_list); //fix for api mis-match
        return this.api.put(`tasks/${task.id}`, task);
    }
    addComment(task, newComment) {
        return this.api.post(`tasks/${task.id}/comments`, { body: newComment, person: { id: this.users.current.id } });
    }
    deleteTask(taskId) {
        return this.api.delete(`tasks/${taskId}`, {id: taskId});
    }
    starTask(task) {
        return this.api.put(`tasks/${task.id}`, {updated_in_db_at: task.updated_in_db_at, starred: !task.starred});
    }
    deleteComment(task, commentId) {
        return this.api.delete(`tasks/${task.id}/comments/${commentId}`).then(() => {
            task.comments = reject({id: commentId}, task.comments);
        });
    }
    bulkDeleteTasks(tasks) {
        tasks = map(task => { return { id: task.id }; }, tasks);
        return this.api.delete({url: 'tasks/bulk', data: tasks, type: 'tasks'});
    }
    bulkCompleteTasks(tasks) {
        tasks = map(task => {
            task.completed = true;
            return task;
        }, tasks);
        return this.api.put('tasks/bulk', tasks);
    }
    bulkEditTasks(tasks, model, comment) {
        tasks = reduce((result, task) => {
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
        }, [], tasks);
        return this.api.put('tasks/bulk', tasks);
    }
    postBulkLogTask(ajaxAction, taskId, model, contactIds, toComplete) {
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
    create(task, contactIds) {
        task.account_list = { id: this.api.account_list_id };
        task.tag_list = joinComma(task.tag_list); //fix for api mis-match
        if (contactIds.length > 1) {
            const tasks = reduce((result, contactId) => {
                if (!isEmpty(contactId)) {
                    result.push(assign(task, {id: uuid(), contacts: [{id: contactId}]}));
                }
                return result;
            }, [], contactIds);
            return this.api.post({ url: 'tasks/bulk', data: tasks, type: 'tasks' });
        }
        task.contacts = map(contactId => { return {id: contactId}; }, contactIds);
        return this.api.post('tasks', task);
    }
    openModal(params = {}) {
        this.modal.open({
            template: require('./add/add.html'),
            controller: 'addTaskController',
            locals: {
                specifiedAction: params.specifiedAction || null,
                specifiedSubject: params.specifiedSubject || null,
                selectedContacts: params.selectedContacts || params.contact || [],
                modalTitle: params.title || 'Add Task',
                isNewsletter: false
            },
            resolve: {
                tags: () => this.tasksTags.load()
            },
            onHide: params.onHide || noop
        });
    }
    openNewsletterModal(params = {}) {
        this.modal.open({
            template: require('./add/newsletter.html'),
            controller: 'addTaskController',
            locals: {
                specifiedAction: params.specifiedAction || null,
                specifiedSubject: params.specifiedSubject || null,
                selectedContacts: params.contact || [],
                modalTitle: params.title || this.gettextCatalog.getString('Add Newsletter'),
                isNewsletter: true
            },
            onHide: params.onHide || noop
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
    openNewTaskModal() {
        this.modal.open({
            template: require('./add/add.html'),
            controller: 'addTaskController',
            locals: {
                specifiedAction: null,
                specifiedSubject: null,
                selectedContacts: [],
                modalTitle: this.gettextCatalog.getString('Add Task')
            },
            resolve: {
                tags: /*@ngInject*/ (tasksTags) => tasksTags.load()
            }
        });
    }
}

export default angular.module('mpdx.tasks.service', [])
    .service('tasks', TasksService).name;
