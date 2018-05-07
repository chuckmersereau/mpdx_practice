import { assign, isNil, map, omitBy } from 'lodash/fp';
import * as uuid from 'uuid/v1';

class BulkEditTaskController {
    comment: any;
    task: any;
    constructor(
        private $rootScope: ng.IRootScopeService,
        private $scope: mgcrea.ngStrap.modal.IModalScope,
        private selectedTasks: any[],
        private api: ApiService,
        private serverConstants: ServerConstantsService,
        private tasks: TasksService,
        private users: UsersService
    ) {
        this.task = {};
    }
    save() {
        return this.bulkEdit(
            this.task,
            this.comment
        ).then(() => {
            this.$scope.$hide();
        });
    }
    bulkEdit(model, comment) {
        const tasks = map((id) => {
            let task = assign({ id: id }, model);
            if (comment) {
                task.comments = [{ id: uuid(), body: comment, person: { id: this.users.current.id } }];
            }
            task = omitBy(isNil, task);
            if (task.no_date) {
                task.start_at = null;
            }
            return task;
        }, this.selectedTasks);
        return this.api.put('tasks/bulk', tasks).then((data) => {
            this.$rootScope.$emit('taskChange');
            return data;
        });
    }
}

import api, { ApiService } from '../../../common/api/api.service';
import tasks, { TasksService } from '../../tasks.service';
import users, { UsersService } from '../../../common/users/users.service';
import { ServerConstantsService } from '../../../common/serverConstants/serverConstants.service';

export default angular.module('mpdx.tasks.bulkEdit.controller', [
    api, tasks, users
]).controller('bulkEditTaskController', BulkEditTaskController).name;
