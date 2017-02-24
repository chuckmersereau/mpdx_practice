class TagsService {
    api;

    constructor(
        $filter, $log, $rootScope,
        api
    ) {
        this.$filter = $filter;
        this.$log = $log;
        this.$rootScope = $rootScope;
        this.api = api;

        this.data = [];
        this.selectedTags = [];
        this.rejectedTags = [];
        this.anyTags = false;

        $rootScope.$on('accountListUpdated', () => {
            this.load();
        });
    }
    load() {
        return this.api.get('tasks/tags', {filter: {account_list_id: this.api.account_list_id}}).then((data) => {
            this.$log.debug('tasks/tags', data);
            this.data = data;
            return data;
        });
    }
    delete(tagName) {
        return this.api.delete('tasks', { tags: [{ all_tasks: true, name: tagName }] }).then(() => {
            this.selectedTags = _.without(tagName);
            this.rejectedTags = _.without(tagName);
            this.data.splice(this.data.indexOf(tagName), 1);
        });
    }
    tag(contextIds, tag) {
        return this.api.post('tasks/bulk_create', {
            add_tag_task_ids: contextIds.join(),
            add_tag_name: tag
        });
    }
    untag(contextIds, tag) {
        return this.api.delete('tasks', {
            tags: [{
                name: tag,
                task_ids: contextIds.join()
            }]
        });
    }
    isTagActive(tag) {
        if (this.selectedTags.length === 0) {
            return true;
        } else {
            return _.includes(this.selectedTags, tag);
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
        this.$rootScope.$emit('tasksTagsChanged');
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
