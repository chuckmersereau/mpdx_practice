import includes from 'lodash/fp/includes';
import map from 'lodash/fp/map';
import reject from 'lodash/fp/reject';
import joinComma from "../../../common/fp/joinComma";

class TagsService {
    api;

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

        $rootScope.$on('accountListUpdated', () => {
            this.load(true);
        });
    }
    change() {
        this.$log.debug('task tags change');
        this.$rootScope.$emit('tasksTagsChanged');
    }
    load(reset = true) {
        if (!reset && this.data) {
            this.loading = false;
            return this.$q.resolve(this.data);
        }

        return this.api.get('tasks/tags', {filter: {account_list_id: this.api.account_list_id}}).then((data) => {
            this.$log.debug('tasks/tags', data);
            this.data = data;
            this.change();
            return data;
        });
    }
    mapDataAsNames() {
        return map(data => data.name, this.data);
    }
    delete(tag) {
        const params = {
            filter: {
                account_list_id: this.api.account_list_id
            },
            name: tag.name
        };
        return this.api.delete({url: 'tasks/tags/bulk', data: params, type: 'tags'}).then(() => {
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
    untag(contextIds, tag) {
        const params = {
            filter: {
                account_list_id: this.api.account_list_id,
                contact_ids: joinComma(contextIds)
            },
            name: tag
        };
        const message = this.gettextCatalog.getString('Are you sure you wish to remove the selected tag?');
        return this.modal.confirm(message).then(() => {
            return this.api.delete({url: 'tasks/tags/bulk', data: params, type: 'tags'});
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
        const selectedIndex = this.selectedTags.indexOf(tag);
        const rejectedIndex = this.rejectedTags.indexOf(tag);
        if (selectedIndex >= 0) {
            this.selectedTags.splice(selectedIndex, 1);
            this.rejectedTags.push(tag);
        } else if (rejectedIndex >= 0) {
            this.rejectedTags.splice(rejectedIndex, 1);
        } else {
            this.selectedTags.push(tag);
        }
        this.change();
    }
    isResettable() {
        return (this.selectedTags.length > 0 || this.rejectedTags.length > 0);
    }
    reset() {
        this.selectedTags = [];
        this.rejectedTags = [];
        this.change();
    }
    getTagsByQuery(query) {
        return this.$filter('filter')(this.data, query);
    }
    addTag(ids, tag) {
        const obj = {
            add_tag_task_ids: ids.join(),
            add_tag_name: tag
        };
        return this.api.post('tasks/tags/bulk_create', obj);
    }
}

export default angular.module('mpdx.tasks.tags.service', [])
    .service('tasksTags', TagsService).name;
