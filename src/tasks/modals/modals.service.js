class ModalsService {
    constructor(
        modal, serverConstants, tasksTags
    ) {
        this.modal = modal;
        this.serverConstants = serverConstants;
        this.tasksTags = tasksTags;
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

import modal from 'common/modal/modal.service';
import serverConstants from 'common/serverConstants/serverConstants.service';
import tasksTags from 'tasks/filter/tags/tags.service';

export default angular.module('mpdx.tasks.modals.service', [
    modal, serverConstants, tasksTags
]).service('tasksModals', ModalsService).name;
