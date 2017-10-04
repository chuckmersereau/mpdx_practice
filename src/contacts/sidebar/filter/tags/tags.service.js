import map from 'lodash/fp/map';
import unionBy from 'lodash/fp/unionBy';
import uuid from 'uuid/v1';

class TagsService {
    constructor(
        $log, $rootScope,
        api
    ) {
        this.$log = $log;
        this.$rootScope = $rootScope;
        this.api = api;

        this.data = [];
        this.selectedTags = [];
        this.rejectedTags = [];
        this.anyTags = false;
    }
    addTag(val) {
        const tags = map((obj) => {
            return { id: uuid(), name: obj };
        }, val.tags);
        this.data = unionBy('name', this.data, tags);
    }
    load() {
        return this.api.get('contacts/tags', { filter: { account_list_id: this.api.account_list_id } }).then((data) => {
            /* istanbul ignore next */
            this.$log.debug('contact/tags:', data);
            this.data = data;
            return data;
        });
    }
    isResettable() {
        return (this.selectedTags.length > 0 || this.rejectedTags.length > 0);
    }
    reset() {
        this.selectedTags = [];
        this.rejectedTags = [];
        this.$rootScope.$emit('contactsTagsChange');
    }
}

import api from 'common/api/api.service';

export default angular.module('mpdx.common.tags.service', [
    api
]).service('contactsTags', TagsService).name;
