class TagsService {
    api;

    constructor($rootScope, api, accountsService, $filter) {
        this.$filter = $filter;
        this.api = api;

        this.data = [];
        this.selectedTags = [];
        this.rejectedTags = [];
        this.anyTags = false;
        this.loading = true;

        $rootScope.$watch(function() {
            return accountsService.account_list_id;
        }, function watchCallback(accountListId) {
            if (accountListId) {
                this.load();
            }
        });

        this.load();
    }
    load() {
        this.loading = true;
        this.api.get('contacts/tags', {}).then((data) => {
            this.data = data;
            this.loading = false;
        });
    }
    delete(tagName) {
        this.api.delete('contacts/tags', { tags: [{ name: tagName, all_contacts: true }] }).then(() => {
            this.selectedTags = _.without(tagName);
            this.rejectedTags = _.without(tagName);
            this.data.splice(this.data.indexOf(tagName), 1);
        });
    }
    tagContact(contactIds, tag, cb) {
        this.api.post('contacts/tags/bulk_create', {
            add_tag_contact_ids: contactIds.join(),
            add_tag_name: tag
        }).then(cb);
    }
    untagContact(contactIds, tag, cb) {
        this.api.delete('contacts/tags', {
            tags: [{
                name: tag,
                contact_ids: contactIds.join()
            }]
        }).then(cb);
    }
    isTagActive(tag) {
        if (this.selectedTags.length === 0) {
            return true;
        } else {
            if (this.selectedTags.indexOf(tag) >= 0) {
                return true;
            } else {
                return false;
            }
        }
    }
    isTagRejected(tag) {
        return this.rejectedTags.indexOf(tag) >= 0;
    }
    tagClick(tag) {
        var selectedIndex = this.selectedTags.indexOf(tag);
        var rejectedIndex = this.rejectedTags.indexOf(tag);
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

export default angular.module('mpdx.services.tags', [])
    .service('tagsService', TagsService).name;