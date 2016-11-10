class TasksService {
    constructor(modal, api) {
        this.modal = modal;
        this.api = api;

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

    fetchTasks(
        collection,
        filters
    ) {
        var meta = this.meta[collection];
        var defaultFilters = this.defaultFilters[collection];
        var obj = Object.assign({
            filters: Object.assign(
                Object.assign({}, defaultFilters),
                filters
            )
        }, meta);
        console.log('fetchTasks');

        this.api.get('tasks/',
            obj,
            function(data) {
                if (data.tasks.length) {
                    this.transformChild(data.tasks, 'comments', data.comments);
                    this.transformChild(data.comments, 'person_id', data.people, true);
                }
                this.data[collection] = data.tasks;
                meta.from = data.meta.from;
                meta.to = data.meta.to;
                meta.page = data.meta.page;
                meta.total = data.meta.total;
                meta.total_pages = data.meta.total_pages;
                console.log(this.data);
            }.bind(this)
        );
    }

    fetchTasksForPage(
        page,
        filters
    ) {
        console.log(this.pages, page);
        this.pages[page].forEach(function(collection) {
            this.fetchTasks(collection, filters);
        });
    }

    transformChild(parentObj, childKey, referredObj, oneToOne) {
        _.each(parentObj, (parent) => {
            var newObj;
            if (oneToOne) {
                newObj = _.find(referredObj, referredItem => referredItem.id === parent[childKey]);
            } else {
                newObj = [];
                _.each(parent[childKey], (id) => {
                    newObj.push(_.find(referredObj, referredItem => referredItem.id === id));
                });
            }
            parent[childKey] = newObj;
        });
    }
    submitNewComment(taskId, newComment, cb) {
        this.api.put('/tasks/' + taskId, {task: {activity_comments_attributes: [{body: newComment}]}}, cb);
    }
    deleteTask(taskId, cb) {
        this.api.delete('/tasks/' + taskId, {}, cb);
    }
    starTask(task, cb) {
        this.api.put('/tasks/' + task.id, {task: {starred: !task.starred}}, cb);
    }
    postBulkLogTask(ajaxAction, taskId, model, contactIds, toComplete) {
        const url = 'tasks/' + (taskId || '');
        return this.api.call(ajaxAction, url, {
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
        });
    }
    postLogTask(taskId, model, cb) {
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

        this.api.put('tasks/' + taskId, objPayload, cb);
    }
    postBulkAddTask(model, contactIds, cb) {
        this.api.post('tasks', {
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
        }).then(() => {
            cb();
        });
    }
    openModal(params) {
        this.modal.open({
            template: require('./add/add.html'),
            controller: 'addTaskController',
            locals: {
                specifiedAction: params.specifiedAction || null,
                specifiedSubject: params.specifiedSubject || null,
                contacts: params.contact || [],
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
                contacts: params.contact || [],
                modalTitle: params.title || 'Add Newsletter',
                isNewsletter: true
            },
            onHide: params.onHide || _.noop
        });
    }
}

export default angular.module('mpdx.common.tasks', [])
    .service('tasksService', TasksService).name;
