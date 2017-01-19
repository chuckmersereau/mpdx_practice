class TasksService {
    api;
    modal;
    tasksFilter;
    tasksTags;

    constructor(
        $log, $q,
        modal, api, tasksFilter, tasksTags
    ) {
        this.$log = $log;
        this.$q = $q;
        this.modal = modal;
        this.api = api;
        this.tasksFilter = tasksFilter;
        this.tasksTags = tasksTags;

        this.analytics = null;
        this.data = {};
        this.sort = 'all';
        this.data = {};

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
            }
        };

        this.meta = {
            completed: _.assign(DEFAULT_PAGINATION, {
                order: 'no_date DESC, start_at'
            }),
            uncompleted: _.assign(DEFAULT_PAGINATION, {
                order: 'no_date DESC, start_at'
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
    fetchTasks(collection) {
        this.data[collection] = [];
        const defaultFilters = this.defaultFilters[collection];
        const wildcardSearch = this.tasksFilter.wildcard_search;
        let filters = _.assign(defaultFilters, this.tasksFilter.params);
        if (wildcardSearch) {
            filters.wildcard_search = wildcardSearch;
        }
        if (this.tasksTags.selectedTags.length > 0) {
            filters.tags = _.map(this.tasksTags.selectedTags, tag => tag.name).join(',');
        }
        if (this.tasksTags.rejectedTags.length > 0) {
            filters.exclude_tags = _.map(this.tasksTags.rejectedTags, tag => tag.name).join(',');
        }
        filters.any_tags = this.tasksTags.anyTags;

        return this.api.get({
            url: 'tasks',
            data: {
                filters: filters,
                include: 'comments,contacts,comments.people',
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
        return this.api.get('tasks', {
            filters: {
                completed: false,
                contact_ids: [id]
            },
            page: 1,
            per_page: 500,
            include: 'comments,contacts',
            order: 'start_at'
        }).then((data) => {
            this.uncompleted = data;
            return data;
        });
    }
    fetchCompletedTasks(id) {
        return this.api.get('tasks', {
            filters: {
                completed: true,
                contact_ids: [id]
            },
            include: 'comments,contacts',
            page: 1,
            per_page: 500,
            sort: 'completed_at'
        }).then((data) => {
            this.completed = data;
            return data;
        });
    }
    fetchTasksForPage(page, filters) {
        _.each(this.pages[page], (collection) => {
            this.fetchTasks(collection, filters);
        });
    }
    save(task) {
        return this.api.put(`tasks/${task.id}`, task);
    }
    submitNewComment(task, newComment) {
        return this.api.put(`tasks/${task.id}`, {updated_in_db_at: task.updated_in_db_at, activity_comment: {body: newComment}});
    }
    // FIXME need review
    deleteTask(taskId) {
        return this.api.delete(`/tasks/${taskId}`, [], () => {
            return true;
        });
    }
    starTask(task) {
        return this.api.put(`tasks/${task.id}`, {updated_in_db_at: task.updated_in_db_at, starred: !task.starred});
    }
    // FIXME need review
    deleteComment(taskId, commentId) {
        return this.api.delete('activity_comments/' + commentId, { activity_id: taskId });
    }
    // FIXME need review
    bulkDeleteTasks(taskIds) {
        return this.api.delete('tasks/bulk_destroy', { ids: taskIds });
    }
    // FIXME need review
    bulkCompleteTasks(taskIds) {
        return this.api.post('tasks/bulk_update', {
            bulk_task_update_ids: taskIds.join(),
            _method: 'put',
            task: {
                completed: true
            }
        });
    }
    // FIXME need review
    bulkEditTasks(taskIds, model) {
        return this.api.post('tasks/bulk_update', {
            bulk_task_update_ids: taskIds.join(),
            _method: 'put',
            task: {
                subject: model.subject,
                activity_type: model.action,
                no_date: model.noDate,
                'start_at(1i)': model.dueDate ? model.dueDate.getFullYear() + '' : undefined,
                'start_at(2i)': model.dueDate ? (model.dueDate.getMonth() + 1) + '' : undefined,
                'start_at(3i)': model.dueDate ? model.dueDate.getDate() + '' : undefined,
                'start_at(4i)': model.dueDate ? model.dueDate.getHours() + '' : undefined,
                'start_at(5i)': model.dueDate ? model.dueDate.getMinutes() + '' : undefined,
                activity_comment: {body: model.comment},
                tag_list: model.tagsList ? model.tagsList.map(tag => tag.text).join() : undefined
            }
        });
    }
    postBulkLogTask(ajaxAction, taskId, model, contactIds, toComplete) {
        let url = 'tasks';
        if (taskId) {
            url += '/' + taskId;
        }
        let contactsData = [];
        _.each(contactIds, (contactId) => {
            contactsData.push({contact_id: contactId});
        });
        let taskData = {
            subject: model.subject,
            activity_type: model.action,
            no_date: model.noDate,
            'start_at(1i)': model.dueDate.getFullYear() + '',
            'start_at(2i)': (model.dueDate.getMonth() + 1) + '',
            'start_at(3i)': model.dueDate.getDate() + '',
            'start_at(4i)': model.dueDate.getHours() + '',
            'start_at(5i)': model.dueDate.getMinutes() + '',
            'completed_at(1i)': model.completedAt.getFullYear() + '',
            'completed_at(2i)': (model.completedAt.getMonth() + 1) + '',
            'completed_at(3i)': model.completedAt.getDate() + '',
            'completed_at(4i)': model.completedAt.getHours() + '',
            'completed_at(5i)': model.completedAt.getMinutes() + '',
            activity_comment: {body: model.comment},
            activity_contacts_attributes: contactsData,
            completed: toComplete || model.result !== null,
            result: model.result,
            tag_list: model.tagsList.map(tag => tag.text).join(),
            updated_in_db_at: model.updated_in_db_at
        };

        return this.api.call({
            method: ajaxAction,
            url: url,
            data: taskData
        });
    }
    // FIXME need review
    postLogTask(task, model) {
        let objPayload = {
            updated_in_db_at: task.updated_in_db_at,
            activity_comment: {body: model.comment},
            completed: true
        };
        if (model.result) {
            objPayload.result = model.result;
        }
        if (model.nextAction) {
            objPayload.nextAction = model.nextAction;
        }

        return this.api.put(`tasks/${task.id}`, objPayload);
    }
    // FIXME need review
    postBulkAddTask(model, contactIds) {
        let contactsData = [];
        _.each(contactIds, (contactId) => {
            contactsData.push({contact_id: contactId});
        });

        let taskData = {
            subject: model.subject,
            activity_type: model.action,
            no_date: model.noDate,
            'start_at(1i)': model.date.getFullYear() + '',
            'start_at(2i)': (model.date.getMonth() + 1) + '',
            'start_at(3i)': model.date.getDate() + '',
            'start_at(4i)': model.date.getHours() + '',
            'start_at(5i)': model.date.getMinutes() + '',
            activity_comment: {body: model.comment},
            activity_contacts_attributes: contactsData,
            tag_list: model.tagsList.map(tag => tag.text).join()
        };

        return this.api.post('tasks', taskData);
    }
    openModal(params) {
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
            onHide: params.onHide || _.noop
        });
    }
    openNewsletterModal(params) {
        this.modal.open({
            template: require('./add/newsletter.html'),
            controller: 'addTaskController',
            locals: {
                specifiedAction: params.specifiedAction || null,
                specifiedSubject: params.specifiedSubject || null,
                selectedContacts: params.contact || [],
                modalTitle: params.title || 'Add Newsletter',
                isNewsletter: true
            },
            onHide: params.onHide || _.noop
        });
    }
    // FIXME need review
    getAnalytics() {
        if (this.analytics) {
            return this.$q.resolve(this.analytics);
        }
        return this.api.get('tasks/analytics').then((data) => {
            this.$log.debug('tasks/analytics', data);
            this.analytics = data;
            return this.analytics;
        }).catch((err) => {
            this.$log.error('tasks/analytics not implemented.', err);
        });
    }
}

export default angular.module('mpdx.tasks.service', [])
    .service('tasksService', TasksService).name;
