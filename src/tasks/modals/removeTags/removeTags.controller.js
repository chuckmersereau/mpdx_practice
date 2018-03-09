import { map, reduce, union } from 'lodash/fp';
import joinComma from 'common/fp/joinComma';

class RemoveTagController {
    constructor(
        $rootScope, $scope, gettextCatalog,
        api, modal, tasksTags,
        selectedTasks, currentListSize
    ) {
        this.$rootScope = $rootScope;
        this.$scope = $scope;
        this.api = api;
        this.gettextCatalog = gettextCatalog;
        this.modal = modal;
        this.selectedTasks = selectedTasks;
        this.tasksTags = tasksTags;
        this.currentListSize = currentListSize;

        this.tags = this.getTagsFromSelectedTasks();
    }
    removeTag(tag) {
        const taskIds = map('id', this.selectedTasks);
        const message = this.gettextCatalog.getString('Are you sure you wish to remove the selected tag?');
        return this.modal.confirm(message).then(() => {
            const successMessage = this.gettextCatalog.getString('Tag successfully removed.');
            return this.api.delete({
                url: 'tasks/tags/bulk',
                data: {
                    data: [{
                        data: {
                            attributes: {
                                name: tag
                            }
                        }
                    }],
                    filter: {
                        account_list_id: this.api.account_list_id,
                        task_ids: joinComma(taskIds)
                    },
                    type: 'tags'
                },
                autoParams: false,
                doSerialization: false,
                successMessage: successMessage
            }).then(() => {
                this.$rootScope.$emit('taskTagDeleted', { taskIds: taskIds, tag: tag });
                this.$scope.$hide();
            });
        });
    }
    getTagsFromSelectedTasks() {
        // if more selected than data, use tasksTags
        if (this.selectedTasks.length > this.currentListSize) {
            return map('name', this.tasksTags.data);
        }
        return reduce((result, task) =>
            union(result, task.tag_list)
            , [], this.selectedTasks).sort();
    }
}

import api from 'common/api/api.service';
import gettextCatalog from 'angular-gettext';
import modal from 'common/modal/modal.service';
import tasksTags from 'tasks/filter/tags/tags.service';

export default angular.module('mpdx.tasks.modals.removeTags.controller', [
    gettextCatalog,
    api, modal, tasksTags
]).controller('removeTaskTagController', RemoveTagController).name;
