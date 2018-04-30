import { find, includes, map, reject, unionBy } from 'lodash/fp';

export class TasksTagsService {
    anyTags: boolean;
    data: any;
    rejectedTags: any;
    selectedTags: any;
    constructor(
        private $filter: ng.IFilterService,
        private $log: ng.ILogService,
        private $q: ng.IQService,
        private $rootScope: ng.IRootScopeService,
        private gettextCatalog: ng.gettext.gettextCatalog,
        private api: ApiService,
        private modal: ModalService
    ) {
        this.data = [];
        this.selectedTags = [];
        this.rejectedTags = [];
        this.anyTags = false;
    }
    change() {
        this.$log.debug('task/tags: change');
        this.$rootScope.$emit('tasksTagsChanged');
    }
    load(reset = true) {
        if (!reset && this.data) {
            return this.$q.resolve(this.data);
        }

        return this.api.get('tasks/tags', { filter: { account_list_id: this.api.account_list_id } }).then((data) => {
            this.$log.debug('tasks/tags', data);
            this.data = data;
            this.change();
            return data;
        });
    }
    delete(tag) {
        const params = {
            filter: {
                account_list_id: this.api.account_list_id
            }
        };


        const data = [{
            name: tag.name
        }];

        return this.api.delete({
            url: 'tasks/tags/bulk',
            params: params,
            data: data,
            type: 'tags',
            fields: {
                tasks: ''
            }
        }).then(() => {
            this.selectedTags = reject({ name: tag.name }, this.selectedTags);
            this.rejectedTags = reject({ name: tag.name }, this.rejectedTags);
            this.data = reject({ name: tag.name }, this.data);
        });
    }
    isTagActive(tag) {
        if (this.selectedTags.length === 0) {
            return true;
        } else {
            return includes(tag, this.selectedTags);
        }
    }
    isTagRejected(tag) {
        return this.rejectedTags.indexOf(tag) >= 0;
    }
    tagClick(tag) {
        if (find({ name: tag.name }, this.selectedTags)) {
            this.rejectTag(tag);
        } else if (find({ name: tag.name }, this.rejectedTags)) {
            this.rejectedTags = reject({ name: tag.name }, this.rejectedTags);
            this.selectedTags = reject({ name: tag.name }, this.selectedTags);
            this.change();
        } else {
            this.selectTag(tag);
        }
    }
    selectTag(tag) {
        this.selectedTags = unionBy('name', this.selectedTags, [tag]);
        this.rejectedTags = reject({ name: tag.name }, this.rejectedTags);
        this.change();
    }
    rejectTag(tag) {
        this.selectedTags = reject({ name: tag.name }, this.selectedTags);
        this.rejectedTags = unionBy('name', this.rejectedTags, [tag]);
        this.change();
    }
    removeFromRejected(tag) {
        this.rejectedTags = reject({ name: tag.name }, this.rejectedTags);
        this.change();
    }
    removeFromSelected(tag) {
        this.selectedTags = reject({ name: tag.name }, this.selectedTags);
        this.change();
    }
    isResettable() {
        return (this.selectedTags.length > 0 || this.rejectedTags.length > 0);
    }
    reset() {
        this.selectedTags = [];
        this.rejectedTags = [];
    }
    getTagsByQuery(query) {
        return this.$filter('filter')(this.data, query);
    }
    addTag(val) {
        const tags = map((obj) => {
            return { name: obj };
        }, val.tags);
        this.data = unionBy('name', this.data, tags);
    }
}

import 'angular-gettext';
import api, { ApiService } from '../../../common/api/api.service';
import modal, { ModalService } from '../../../common/modal/modal.service';

export default angular.module('mpdx.tasks.tags.service', [
    'gettext',
    api, modal
]).service('tasksTags', TasksTagsService).name;
