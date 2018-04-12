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

        this.hideTags = true;
    }
    $onInit() {
        this.$rootScope.$on('accountListUpdated', () => {
            this.contactsTags.load();
        });
    }
    changeAny(val) {
        this.contactsTags.anyTags = val;
        this.contactsTags.change();
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
}

const Tags = {
    controller: TagsController,
    template: require('./tags.html')
};

import contactsTags from './tags.service';

export default angular.module('mpdx.contacts.filter.tags.component', [
    contactsTags
]).component('contactsTags', Tags).name;
