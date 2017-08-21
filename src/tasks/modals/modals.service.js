import isArray from 'lodash/fp/isArray';

class ModalsService {
    constructor(
        modal, serverConstants, tasksTags
    ) {
        this.modal = modal;
        this.serverConstants = serverConstants;
        this.tasksTags = tasksTags;
    }
    add(contactsList = [], activityType = null) {
        contactsList = isArray(contactsList) ? contactsList : [contactsList];
        return this.modal.open({
            template: require('./add/add.html'),
            controller: 'addTaskController',
            resolve: {
                tags: () => this.tasksTags.load(),
                0: () => this.serverConstants.load(['activity_hashes'])
            },
            locals: {
                contactsList: contactsList,
                activityType: activityType
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
            },
            resolve: {
                0: () => this.serverConstants.load(['next_actions', 'results', 'status_hashes'])
            }
        });
    }
    edit(task) {
        return this.modal.open({
            template: require('./edit/edit.html'),
            controller: 'editTaskController',
            locals: {
                task: task
            },
            resolve: {
                0: () => this.serverConstants.load(['activity_hashes', 'results'])
            }
        });
    }
    bulkEdit(tasks) {
        return this.modal.open({
            template: require('./bulkEdit/bulkEdit.html'),
            controller: 'bulkEditTaskController',
            locals: {
                selectedTasks: tasks
            },
            resolve: {
                0: () => this.serverConstants.load(['activity_hashes'])
            }
        });
    }
}

import serverConstants from 'common/serverConstants/serverConstants.service';

export default angular.module('mpdx.tasks.modals.service', [
    serverConstants
]).service('tasksModals', ModalsService).name;
