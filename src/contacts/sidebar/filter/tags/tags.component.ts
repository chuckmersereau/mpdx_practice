import { includes, isNil, reject } from 'lodash/fp';
import api, { ApiService } from '../../../../common/api/api.service';
import contactsTags, { ContactsTagsService } from './tags.service';
import session, { SessionService } from '../../../../common/session/session.service';
import users, { UsersService } from '../../../../common/users/users.service';

class TagsController {
    hideTags: boolean;
    isCollapsed: boolean;
    watcher: () => void;
    watcher2: () => void;
    constructor(
        private $log: ng.ILogService,
        private $scope: ng.IScope,
        private $rootScope: ng.IRootScopeService,
        private api: ApiService,
        private contactsTags: ContactsTagsService,
        private session: SessionService,
        private users: UsersService
    ) {
        this.hideTags = true;
    }
    $onInit() {
        this.isCollapsed = this.users.getCurrentOptionValue('contact_tags_collapse');
        this.watcher = this.$rootScope.$on('accountListUpdated', () => {
            this.contactsTags.load();
        });
        this.watcher2 = this.$scope.$watch('$ctrl.isCollapsed', (newVal) => {
            if (!isNil(newVal)) {
                this.users.saveOption('contact_tags_collapse', this.isCollapsed);
            }
        });
    }
    $onDestroy() {
        this.watcher();
        this.watcher2();
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
        return this.api.delete({
            url: 'contacts/tags/bulk',
            params: params,
            data: data,
            type: 'tags',
            fields: {
                contacts: ''
            }
        }).then(() => {
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

export default angular.module('mpdx.contacts.filter.tags.component', [
    api, contactsTags, session, users
]).component('contactsTags', Tags).name;
