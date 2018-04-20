import { find, includes, map, reject, unionBy } from 'lodash/fp';

class TagsService {
    constructor(
        $filter, $log, $q, $rootScope, gettextCatalog,
        api, modal
    ) {
        this.$filter = $filter;
        this.$log = $log;
        this.$q = $q;
        this.$rootScope = $rootScope;
        this.api = api;
        this.gettextCatalog = gettextCatalog;
        this.modal = modal;

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

        return this.api.delete({ url: 'tasks/tags/bulk', params: params, data: data, type: 'tags' }).then(() => {
            this.selectedTags = reject({ name: tag.name }, this.selectedTags);
            this.rejectedTags = reject({ name: tag.name }, this.rejectedTags);
            this.data = reject({ name: tag.name }, this.data);
        });
    }
    tag(contextIds, tag) {
        return this.api.post('tasks/bulk_create', {
            add_tag_task_ids: contextIds.join(),
            add_tag_name: tag
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

import api from 'common/api/api.service';
import gettext from 'angular-gettext';
import modal from 'common/modal/modal.service';

export default angular.module('mpdx.tasks.tags.service', [
    gettext,
    api, modal
]).service('tasksTags', TagsService).name;
