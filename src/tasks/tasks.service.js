class TasksService {
    api;
    modal;

    constructor(modal, api) {
        this.modal = modal;
        this.api = api;

        this.data = {};
        this.loading = true;
    }
    fetchUncompletedTasks(id) {
        return this.api.get('tasks/', {
            filters: {
                completed: false,
                contact_ids: [id],
                page: 1,
                per_page: 500,
                order: 'start_at'
            }
        }).then((data) => {
            if (data.tasks.length) {
                this.transformChild(data.tasks, 'comments', data.comments);
                this.transformChild(data.comments, 'person_id', data.people, true);
            }
            this.data.uncompleted = data.tasks;
        });
    }
    fetchCompletedTasks(id) {
        return this.api.get('tasks/', {
            filters: {
                completed: true,
                contact_ids: [id],
                page: 1,
                per_page: 500,
                order: 'completed_at desc'
            }
        }).then((data) => {
            if (data.tasks.length) {
                this.transformChild(data.tasks, 'comments', data.comments);
                this.transformChild(data.comments, 'person_id', data.people, true);
            }
            this.data.completed = data.tasks;
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
    submitNewComment(taskId, newComment) {
        return this.api.put(`/tasks/${taskId}`, {task: {activity_comments_attributes: [{body: newComment}]}});
    }
    deleteTask(taskId) {
        return this.api.delete(`/tasks/${taskId}`);
    }
    starTask(task) {
        return this.api.put(`/tasks/${task.id}`, {task: {starred: !task.starred}});
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
            contentTemplate: '/common/bulk_add_task.html',
            controller: 'bulkAddTaskController',
            controllerAs: 'vm',
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
            contentTemplate: '/common/newsletter/add/add.html',
            controller: 'bulkAddTaskController',
            controllerAs: 'vm',
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
