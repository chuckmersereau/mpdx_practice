import { includes, reject } from 'lodash/fp';

class TagsController {
    constructor(
        $log, $rootScope,
        api, contactsTags
    ) {
        this.$log = $log;
        this.$rootScope = $rootScope;
        this.api = api;
        this.contactsTags = contactsTags;
    }
    $onInit() {
        this.$rootScope.$on('accountListUpdated', () => {
            this.contactsTags.load();
        });
    }
    change() {
        this.$log.debug('contact/tags: change');
        this.$rootScope.$emit('contactsTagsChange');
    }
    changeAny(val) {
        this.contactsTags.anyTags = val;
        this.change();
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
        return this.api.delete({ url: 'contacts/tags/bulk', params: params, data: data, type: 'tags' }).then(() => {
            this.contactsTags.selectedTags = reject({ name: tag.name }, this.contactsTags.selectedTags);
            this.contactsTags.rejectedTags = reject({ name: tag.name }, this.contactsTags.rejectedTags);
            this.contactsTags.data = reject({ name: tag.name }, this.contactsTags.data);
            this.$rootScope.$emit('contactTagDeleted', { tag: tag.name });
        });
    }
    isTagActive(tag) {
        if (this.contactsTags.selectedTags.length === 0) {
            return true;
        } else {
            return includes(tag, this.contactsTags.selectedTags);
        }
    }
    isTagRejected(tag) {
        return this.contactsTags.rejectedTags.indexOf(tag) >= 0;
    }
    tagClick(tag) {
        const selectedIndex = this.contactsTags.selectedTags.indexOf(tag);
        const rejectedIndex = this.contactsTags.rejectedTags.indexOf(tag);
        if (selectedIndex >= 0) {
            this.contactsTags.selectedTags.splice(selectedIndex, 1);
            this.contactsTags.rejectedTags.push(tag);
        } else if (rejectedIndex >= 0) {
            this.contactsTags.rejectedTags.splice(rejectedIndex, 1);
        } else {
            this.contactsTags.selectedTags.push(tag);
        }
        this.change();
    }
}

const Tags = {
    controller: TagsController,
    template: require('./tags.html')
};

import contactsTags from './tags.service';

export default angular.module('mpdx.contacts.filter.tags.component', [
    contactsTags
]).component('contactsTags', Tags).name;
