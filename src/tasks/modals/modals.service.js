class ModalsService {
    constructor(
        modal, tasksTags
    ) {
        this.modal = modal;
        this.tasksTags = tasksTags;
    }
    add(contactsList = []) {
        if (!Array.isArray(contactsList)) {
            contactsList = [contactsList];
        }
        return this.modal.open({
            template: require('./add/add.html'),
            controller: 'addTaskController',
            resolve: {
                tags: () => this.tasksTags.load()
            },
            locals: {
                contactsList: contactsList
            }
        });
    }
    log(contactsList = []) {
        if (!Array.isArray(contactsList)) {
            contactsList = [contactsList];
        }
        return this.modal.open({
            template: require('./log/log.html'),
            controller: 'logTaskController',
            resolve: {
                tags: () => this.tasksTags.load()
            },
            locals: {
                contactsList: contactsList
            }
        });
    }
    newsletter() {
        return this.modal.open({
            template: require('./newsletter/newsletter.html'),
            controller: 'newsletterTaskController'
        });
    }
    complete(task) {
        return this.modal.open({
            template: require('./complete/complete.html'),
            controller: 'completeTaskController',
            locals: {
                task: task
            }
        });
    }
    edit(task) {
        return this.modal.open({
            template: require('./edit/edit.html'),
            controller: 'editTaskController',
            locals: {
                task: task
            }
        });
    }
    bulkEdit(tasks) {
        return this.modal.open({
            template: require('./bulkEdit/bulkEdit.html'),
            controller: 'bulkEditTaskController',
            locals: {
                selectedTasks: tasks
            }
        });
    }
}

export default angular.module('mpdx.tasks.modals.service', [])
    .service('tasksModals', ModalsService).name;
