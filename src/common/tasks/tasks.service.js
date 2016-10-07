class TasksService {
     constructor($modal, api) {
         this.$modal = $modal;
         this.api = api;

         this.data = {};
         this.loading = true;
     }
     fetchUncompletedTasks(id) {
        this.api.get('tasks/', {
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
        this.api.get('tasks/', {
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
    submitNewComment(taskId, newComment, cb) {
        this.api.put('/tasks/' + taskId, {task: {activity_comments_attributes: [{body: newComment}]}}, cb);
    }
    deleteTask(taskId, cb) {
        this.api.delete('/tasks/' + taskId, {}, cb);
    }
    starTask(task, cb) {
        this.api.put('/tasks/' + task.id, {task: {starred: !task.starred}}, cb);
    }
    postBulkLogTask(ajaxAction, taskId, model, contactIds, toComplete, cb) {
        const url = 'tasks/' + (taskId ? taskId : '');
        this.api.call(ajaxAction, url, {
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
                completed: toComplete ? true : model.result ? true : false,
                result: model.result,
                tag_list: model.tagsList.map(function (tag) {
                    return tag.text;
                }).join()
            }
        }).then(() => {
            cb();
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
                tag_list: model.tagsList.map(function (tag) {
                    return tag.text;
                }).join()
            }
        }).then(() => {
            cb();
        });
    }
    openModal(params) {
        this.$modal({
            templateUrl: '/templates/modal.html',
            contentTemplate: '/templates/common/bulk_add_task.html',
            animation: 'am-fade-and-scale',
            placement: 'center',
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
        this.$modal({
            templateUrl: '/templates/modal.html',
            contentTemplate: '/templates/common/newsletter/add/add.html',
            animation: 'am-fade-and-scale',
            placement: 'center',
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

export default angular.module('mpdxApp.common.tasks',[])
        .service('contacts.tasksService', TasksService).name;
