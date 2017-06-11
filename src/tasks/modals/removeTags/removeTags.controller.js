import map from 'lodash/fp/map';
import reduce from 'lodash/fp/reduce';
import union from 'lodash/fp/union';
import joinComma from 'common/fp/joinComma';

class RemoveTagController {
    selectedContacts;
    contacts;
    contactsTags;

    constructor(
        $rootScope, $scope, gettextCatalog,
        alerts, api, modal, tasksTags,
        selectedTasks, currentListSize
    ) {
        this.$rootScope = $rootScope;
        this.$scope = $scope;
        this.alerts = alerts;
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
        const params = [{
            filter: {
                account_list_id: this.api.account_list_id,
                task_ids: joinComma(taskIds)
            },
            name: tag
        }];
        const message = this.gettextCatalog.getString('Are you sure you wish to remove the selected tag?');
        return this.modal.confirm(message).then(() => {
            return this.api.delete({url: 'tasks/tags/bulk', data: params, type: 'tags'}).then(() => {
                this.alerts.addAlert(this.gettextCatalog.getString('Tag successfully removed.'));
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

import alerts from 'common/alerts/alerts.service';
import api from 'common/api/api.service';
import gettextCatalog from 'angular-gettext';
import modal from 'common/modal/modal.service';
import tasksTags from 'tasks/filter/tags/tags.service';

export default angular.module('mpdx.tasks.modals.removeTags.controller', [
    gettextCatalog,
    alerts, api, modal, tasksTags
]).controller('removeTaskTagController', RemoveTagController).name;
