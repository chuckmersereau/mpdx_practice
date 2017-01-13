class TagsService {
    constructor(
        $filter, $log, $rootScope,
        api
    ) {
        this.$filter = $filter;
        this.$log = $log;
        this.api = api;

        this.data = null;
        this.selectedTags = [];
        this.rejectedTags = [];
        this.anyTags = false;

        this.load();

        $rootScope.$on('accountListUpdated', () => {
            this.load();
        });
    }
    load() {
        return this.api.get('tasks/tags').then((data) => {
            this.$log.debug('tasks/tags', data);
            this.data = data;
            return data;
        });
    }
    delete(tagName) {
        const obj = {
            tags: [{
                all_tasks: true,
                name: tagName
            }]
        };
        return this.api.delete('tasks', obj).then(() => {
            this.selectedTags = _.without(tagName);
            this.rejectedTags = _.without(tagName);
            this.data.splice(this.data.indexOf(tagName), 1);
        });
    }
    tag(contextIds, tag) {
        const obj = {
            add_tag_task_ids: contextIds.join(),
            add_tag_name: tag
        };
        return this.api.post('tasks/bulk_create', obj);
    }
    untag(contextIds, tag) {
        const obj = {
            tags: [{
                task_ids: contextIds.join(),
                name: tag
            }]
        };
        return this.api.delete('tasks', obj);
    }
    isTagActive(tag) {
        if (this.selectedTags.length === 0) {
            return true;
        } else {
            return this.selectedTags.indexOf(tag) >= 0;
        }
    }
    isTagRejected(tag) {
        return this.rejectedTags.indexOf(tag) >= 0;
    }
    tagClick(tag) {
        if (this.selectedTags.indexOf(tag) >= 0) {
            this.selectedTags = _.without(this.selectedTags, tag);
            this.rejectedTags = _.concat(this.rejectedTags, tag);
        } else if (this.rejectedTags.indexOf(tag) >= 0) {
            this.rejectedTags = _.without(this.rejectedTags, tag);
        } else {
            this.selectedTags = _.concat(this.selectedTags, tag);
        }
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
