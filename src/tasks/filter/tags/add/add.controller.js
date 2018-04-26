import { map } from 'lodash/fp';

class AddTagController {
    constructor(
        $rootScope, $scope,
        api, tasksTags, tasks,
        selectedTasks
    ) {
        this.$rootScope = $rootScope;
        this.$scope = $scope;
        this.api = api;
        this.tasks = tasks;
        this.tasksTags = tasksTags;
        this.selectedTasks = selectedTasks;

        this.tags = [];
    }
    save(tag) {
        const tagToAdd = tag ? [tag] : this.tags;
        if (!tagToAdd) {
            return;
        }

        return this.api.post({
            url: 'tasks/tags/bulk',
            data: {
                data: map((tag) => ({
                    data: {
                        type: 'tags',
                        attributes: { name: tag }
                    }
                }), tagToAdd),
                filter: {
                    account_list_id: this.api.account_list_id,
                    task_ids: this.selectedTasks.join()
                },
                fields: {
                    tasks: ''
                }
            },
            doSerialization: false,
            autoParams: false
        }).then(() => {
            const tag = { tags: tagToAdd, taskIds: this.selectedTasks };
            this.$rootScope.$emit('taskTagsAdded', tag);
            this.tasksTags.addTag(tag);
            this.$scope.$hide();
        });
    }
}

import api from 'common/api/api.service';
import contacts from 'tasks/tasks.service';
import contactsTags from '../tags.service';

export default angular.module('mpdxApp.tasks.filter.tags.add.controller', [
    api, contacts, contactsTags
]).controller('addTaskTagController', AddTagController).name;
