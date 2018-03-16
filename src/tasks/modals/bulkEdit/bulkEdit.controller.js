import { assign, isNil, map, omitBy } from 'lodash/fp';
import uuid from 'uuid/v1';

class BulkEditTaskController {
    constructor(
        $rootScope, $scope,
        selectedTasks,
        api, serverConstants, tasks, users
    ) {
        this.$rootScope = $rootScope;
        this.$scope = $scope;
        this.api = api;
        this.serverConstants = serverConstants;
        this.selectedTasks = selectedTasks;
        this.tasks = tasks;
        this.users = users;

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
            return omitBy(isNil, task);
        }, this.selectedTasks);
        return this.api.put('tasks/bulk', tasks).then((data) => {
            this.$rootScope.$emit('taskChange');
            return data;
        });
    }
}

import api from 'common/api/api.service';
import tasks from 'tasks/tasks.service';
import users from 'common/users/users.service';

export default angular.module('mpdx.tasks.bulkEdit.controller', [
    api, tasks, users
]).controller('bulkEditTaskController', BulkEditTaskController).name;
