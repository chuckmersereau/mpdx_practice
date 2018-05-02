import { find, map, reject, unionBy } from 'lodash/fp';
import * as uuid from 'uuid/v1';

interface ITag {
    id?: string,
    name: string
}

export class ContactsTagsService {
    anyTags: boolean;
    data: any;
    rejectedTags: any[];
    selectedTags: any[];
    constructor(
        private $log: ng.ILogService,
        private $rootScope: ng.IRootScopeService,
        private api: ApiService
    ) {
        this.data = [];
        this.selectedTags = [];
        this.rejectedTags = [];
        this.anyTags = false;
    }
    addTag(val: any): void {
        const tags = map((obj) => {
            return { id: uuid(), name: obj };
        }, val.tags);
        this.data = unionBy('name', this.data, tags);
    }
    load(): ng.IPromise<any> {
        return this.api.get('contacts/tags', { filter: { account_list_id: this.api.account_list_id } }).then((data) => {
            /* istanbul ignore next */
            this.$log.debug('contact/tags:', data);
            this.data = data;
            return data;
        });
    }
    isResettable(): boolean {
        return (this.selectedTags.length > 0 || this.rejectedTags.length > 0);
    }
    reset(): void {
        this.selectedTags = [];
        this.rejectedTags = [];
        this.$rootScope.$emit('contactsTagsChange');
    }
    tagClick(tag: ITag): void {
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
    selectTag(tag: ITag): void {
        this.selectedTags = unionBy('name', this.selectedTags, [tag]);
        this.rejectedTags = reject({ name: tag.name }, this.rejectedTags);
        this.change();
    }
    rejectTag(tag: ITag): void {
        this.selectedTags = reject({ name: tag.name }, this.selectedTags);
        this.rejectedTags = unionBy('name', this.rejectedTags, [tag]);
        this.change();
    }
    removeFromRejected(tag: ITag): void {
        this.rejectedTags = reject({ name: tag.name }, this.rejectedTags);
        this.change();
    }
    removeFromSelected(tag: ITag): void {
        this.selectedTags = reject({ name: tag.name }, this.selectedTags);
        this.change();
    }
    change(): void {
        this.$log.debug('contact/tags: change');
        this.$rootScope.$emit('contactsTagsChange');
    }
}

import api, { ApiService } from '../../../../common/api/api.service';

export default angular.module('mpdx.common.tags.service', [
    api
]).service('contactsTags', ContactsTagsService).name;
