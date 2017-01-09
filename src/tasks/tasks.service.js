class TasksService {
    api;
    modal;
    filterService;
    tagsService;

    constructor($log, modal, api, tasksFilterService, tasksTagsService) {
        this.$log = $log;
        this.modal = modal;
        this.api = api;
        this.filterService = tasksFilterService;
        this.tagsService = tasksTagsService;

        this.analytics = null;
        this.data = {};
        this.loading = true;
        this.sort = 'all';
        this.data = {};
        this.pages = {
            contactShow: ['completed', 'uncompleted'],
            tasksList: ['today', 'overdue', 'upcoming', 'tomorrow', 'noDueDate', 'starred', 'allCompleted']
        };
        let DEFAULT_PER_PAGE = 10;
        this.meta = {
            completed: {
                page: 1,
                per_page: DEFAULT_PER_PAGE,
                order: 'no_date DESC, start_at'
            },
            uncompleted: {
                page: 1,
                per_page: DEFAULT_PER_PAGE,
                order: 'no_date DESC, start_at'
            },
            today: {
                page: 1,
                per_page: DEFAULT_PER_PAGE
            },
            overdue: {
                page: 1,
                per_page: DEFAULT_PER_PAGE
            },
            upcoming: {
                page: 1,
                per_page: DEFAULT_PER_PAGE
            },
            tomorrow: {
                page: 1,
                per_page: DEFAULT_PER_PAGE
            },
            noDueDate: {
                page: 1,
                per_page: DEFAULT_PER_PAGE
            },
            starred: {
                page: 1,
                per_page: DEFAULT_PER_PAGE
            },
            allCompleted: {
                page: 1,
                per_page: DEFAULT_PER_PAGE
            }
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

    fetchTasks(collection, filters) {
        this.data[collection] = [];

        const meta = this.meta[collection];
        const defaultFilters = this.defaultFilters[collection];

        const wildcardSearch = this.filterService.wildcard_search;
        if (wildcardSearch) {
            filters.wildcard_search = wildcardSearch;
        }

        const obj = Object.assign({
            filters: Object.assign(
                Object.assign({}, defaultFilters),
                filters
            ),
            include: 'comments'
        }, meta);

        return this.api.get('tasks', obj).then((data) => {
            this.data[collection] = data;
            meta.page = parseInt(data.meta.pagination.page, 10);
            meta.per_page = parseInt(data.meta.pagination.per_page, 10);
            meta.total = parseInt(data.meta.pagination.total_count, 10);
            meta.total_pages = parseInt(data.meta.pagination.total_pages, 10);
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
            include: 'comments',
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
            include: 'comments',
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

    submitNewComment(task, newComment) {
        return this.api.put(`tasks/${task.id}`, {updated_in_db_at: task.updated_in_db_at, activity_comment: {body: newComment}});
    }
    deleteTask(taskId) {
        return this.api.delete(`/tasks/${taskId}`, [], () => {
            return true;
        });
    }
    starTask(task) {
        return this.api.put(`tasks/${task.id}`, {updated_in_db_at: task.updated_in_db_at, starred: !task.starred});
    }
    deleteComment(taskId, commentId) {
        return this.api.delete('activity_comments/' + commentId, { activity_id: taskId });
    }
    bulkDeleteTasks(taskIds) {
        return this.api.delete('tasks/bulk_destroy', { ids: taskIds });
    }
    bulkCompleteTasks(taskIds) {
        return this.api.post('tasks/bulk_update', {
            bulk_task_update_ids: taskIds.join(),
            _method: 'put',
            task: {
                completed: true
            }
        });
    }
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
                activity_comments_attributes: [
                    {
                        body: model.comment
                    }
                ],
                tag_list: model.tagsList ? model.tagsList.map(tag => tag.text).join() : undefined
            }
        });
    }
    postBulkLogTask(ajaxAction, taskId, model, contactIds, toComplete) {
        const url = 'tasks/' + (taskId || '');
        return this.api.call({
            methd: ajaxAction,
            url: url,
            data: {
                add_task_contact_ids: contactIds.join(),
                task: {
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
                    activity_comments_attributes: [
                        {
                            body: model.comment
                        }
                    ],
                    completed: toComplete || model.result,
                    result: model.result,
                    tag_list: model.tagsList.map(tag => tag.text).join()
                }
            }
        });
    }
    postLogTask(taskId, model) {
        let objPayload = {
            task: {
                activity_comment: {
                    body: model.comment
                },
                completed: true
            }
        };
        if (model.result) {
            objPayload.task.result = model.result;
        }
        if (model.nextAction) {
            objPayload.task.nextAction = model.nextAction;
        }

        return this.api.put(`tasks/${taskId}`, objPayload);
    }
    postBulkAddTask(model, contactIds) {
        return this.api.post('tasks', {
            add_task_contact_ids: contactIds.join(),
            task: {
                subject: model.subject,
                activity_type: model.action,
                no_date: model.noDate,
                'start_at(1i)': model.date.getFullYear() + '',
                'start_at(2i)': (model.date.getMonth() + 1) + '',
                'start_at(3i)': model.date.getDate() + '',
                'start_at(4i)': model.date.getHours() + '',
                'start_at(5i)': model.date.getMinutes() + '',
                activity_comments_attributes: [
                    {
                        body: model.comment
                    }
                ],
                tag_list: model.tagsList.map(tag => tag.text).join()
            }
        });
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
