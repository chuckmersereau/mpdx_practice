import assign from 'lodash/fp/assign';
import emptyToNull from 'common/fp/emptyToNull';
import isNil from 'lodash/fp/isNil';
import joinComma from 'common/fp/joinComma';
import map from 'lodash/fp/map';
import omitBy from 'lodash/fp/omitBy';
import uuid from 'uuid/v1';

class BulkEditTaskController {
    constructor(
        $rootScope, $scope,
        selectedTasks,
        api, tasksTags, serverConstants, tasks, users
    ) {
        this.$rootScope = $rootScope;
        this.$scope = $scope;
        this.api = api;
        this.serverConstants = serverConstants;
        this.selectedTasks = selectedTasks;
        this.tasksTags = tasksTags;
        this.tasks = tasks;
        this.users = users;

        this.task = {};
        this.tags = [];
    }
    save() {
        return this.bulkEdit(
            this.task,
            this.comment,
            this.tags
        ).then(() => {
            this.$scope.$hide();
        });
    }
    bulkEdit(model, comment, tags) {
        const tasks = map((id) => {
            let task = assign({ id: id }, model);
            if (comment) {
                task.comments = [{ id: uuid(), body: comment, person: { id: this.users.current.id } }];
            }
            task.tag_list = emptyToNull(joinComma(tags));
            return omitBy(isNil, task);
        }, this.selectedTasks);
        return this.api.put('tasks/bulk', tasks).then((data) => {
            this.tasksTags.change();
            this.$rootScope.$emit('taskChange');
            return data;
        });
    }
}

import api from 'common/api/api.service';
import tasks from 'tasks/tasks.service';
import tasksTags from 'tasks/filter/tags/tags.service';
import users from 'common/users/users.service';

export default angular.module('mpdx.tasks.bulkEdit.controller', [
    api, tasks, tasksTags, users
]).controller('bulkEditTaskController', BulkEditTaskController).name;
