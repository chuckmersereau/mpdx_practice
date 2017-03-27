import includes from 'lodash/fp/includes';
import map from 'lodash/fp/map';
import reject from 'lodash/fp/reject';
import unionBy from 'lodash/fp/unionBy';
import joinComma from "../../../common/fp/joinComma";
import uuid from 'uuid/v1';

class TagsService {
    api;
    modal;

    constructor(
        $filter, $log, $rootScope, gettextCatalog,
        api, modal
    ) {
        this.$filter = $filter;
        this.$log = $log;
        this.$rootScope = $rootScope;
        this.api = api;
        this.gettextCatalog = gettextCatalog;
        this.modal = modal;

        this.data = [];
        this.selectedTags = [];
        this.rejectedTags = [];
        this.anyTags = false;

        $rootScope.$on('accountListUpdated', () => {
            this.load();
        });

        $rootScope.$on('contactTagsAdded', (e, val) => {
            const tags = map(obj => {
                return {id: uuid(), name: obj};
            }, val.tags);
            this.data = unionBy('name', this.data, tags);
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
        const params = {
            filter: {
                account_list_id: this.api.account_list_id
            },
            name: tag.name
        };
        return this.api.delete({url: 'contacts/tags/bulk', data: params, type: 'tags'}).then(() => {
            this.selectedTags = reject({ name: tag.name }, this.selectedTags);
            this.rejectedTags = reject({ name: tag.name }, this.rejectedTags);
            this.data = reject({ name: tag.name }, this.data);
            this.$rootScope.$emit('contactTagDeleted', {tag: tag.name});
        });
    }
    tagContact(contactIds, tag) {
        return this.api.post('contacts/tags/bulk', {
            add_tag_contact_ids: contactIds.join(),
            add_tag_name: tag
        });
    }
    untagContact(contactIds, tag) {
        const params = {
            filter: {
                account_list_id: this.api.account_list_id,
                contact_ids: joinComma(contactIds)
            },
            name: tag
        };
        const message = this.gettextCatalog.getString('Are you sure you wish to remove the selected tag?');
        return this.modal.confirm(message).then(() => {
            return this.api.delete({url: 'contacts/tags/bulk', data: params, type: 'tags'}).then(() => {
                this.$rootScope.$emit('contactTagDeleted', {tag: tag.name, contactIds: contactIds});
                return this.load();
            });
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
        this.$rootScope.$emit('contactParamChange');
    }
    changeAny(val) {
        this.anyTags = val;
        this.$rootScope.$emit('contactParamChange');
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
