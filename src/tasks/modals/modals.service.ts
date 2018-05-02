import { TasksService } from '../tasks.service';

export class TasksModalsService {
    constructor(
        private modal: ModalService,
        private serverConstants: ServerConstantsService,
        private tasksTags: TasksService
    ) {}
    bulkEdit(tasks: any[]): ng.IPromise<any> {
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

import modal, { ModalService } from '../../common/modal/modal.service';
import serverConstants, { ServerConstantsService } from '../../common/serverConstants/serverConstants.service';
import tasksTags from '../filter/tags/tags.service';

export default angular.module('mpdx.tasks.modals.service', [
    modal, serverConstants, tasksTags
]).service('tasksModals', TasksModalsService).name;
