import { map } from 'lodash/fp';
import api, { ApiService } from '../../../../common/api/api.service';
import contacts from '../../../tasks.service';
import contactsTags, { TasksTagsService } from '../tags.service';

class AddTagController {
    tags: any[];
    constructor(
        private $rootScope: ng.IRootScopeService,
        private $scope: mgcrea.ngStrap.modal.IModalScope,
        private api: ApiService,
        private tasksTags: TasksTagsService,
        private tasks: TasksTagsService,
        private selectedTasks: string[]
    ) {
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

export default angular.module('mpdxApp.tasks.filter.tags.add.controller', [
    api, contacts, contactsTags
]).controller('addTaskTagController', AddTagController).name;
