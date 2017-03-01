class TagsService {
    api;

    constructor(
        $filter, $log, $rootScope,
        api
    ) {
        this.$filter = $filter;
        this.$log = $log;
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
        return this.api.get('contacts/tags', {filter: {account_list_id: this.api.account_list_id}}).then((data) => {
            this.$log.debug('contact/tags:', data);
            this.data = data;
            return data;
        });
    }
    delete(tag) {
        return this.api.delete({url: 'contacts/tags/bulk', data: { tag_name: tag.name }, type: 'bulk'}).then(() => {
            this.selectedTags = _.reject(this.selectedTags, { name: tag.name });
            this.rejectedTags = _.reject(this.rejectedTags, { name: tag.name });
            this.data = _.reject(this.data, { name: tag.name });
        });
    }
    tagContact(contactIds, tag) {
        return this.api.post('contacts/tags/bulk_create', {
            add_tag_contact_ids: contactIds.join(),
            add_tag_name: tag
        });
    }
    untagContact(contactIds, tag) {
        return this.api.delete('contacts/tags', {
            tags: [{
                name: tag,
                contact_ids: contactIds.join()
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
}

export default angular.module('mpdx.common.tags.service', [])
    .service('contactsTags', TagsService).name;
