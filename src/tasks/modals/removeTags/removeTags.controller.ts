import 'angular-gettext';
import { map, reduce, union } from 'lodash/fp';
import api, { ApiService } from '../../../common/api/api.service';
import joinComma from '../../../common/fp/joinComma';
import modal, { ModalService } from '../../../common/modal/modal.service';
import tasksTags, { TasksTagsService } from '../../filter/tags/tags.service';

class RemoveTagController {
    tags: any[];
    constructor(
        private $rootScope: ng.IScope,
        private $scope: mgcrea.ngStrap.modal.IModalScope,
        private gettextCatalog: ng.gettext.gettextCatalog,
        private api: ApiService,
        private modal: ModalService,
        private tasksTags: TasksTagsService,
        private selectedTasks: any[],
        private currentListSize: number
    ) {
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
                    type: 'tags',
                    fields: {
                        tasks: ''
                    }
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

export default angular.module('mpdx.tasks.modals.removeTags.controller', [
    'gettext',
    api, modal, tasksTags
]).controller('removeTaskTagController', RemoveTagController).name;
