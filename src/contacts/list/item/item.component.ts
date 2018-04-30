import isOverflown from '../../../common/fp/isOverflown';
import { flatten, includes, map, pull, union } from 'lodash/fp';
import * as moment from 'moment';

class ItemController {
    contact: any;
    isOverflown: any;
    tagsExpanded: any;
    watcher: any;
    watcher2: any;
    constructor(
        private $rootScope: ng.IRootScopeService,
        private $scope: ng.IScope,
        private contacts: ContactsService,
        private people: PeopleService,
        private users: UsersService
    ) {
        this.isOverflown = isOverflown; // to allow testing
    }
    $onInit() {
        this.tagsExpanded = false;
        this.watcher = this.$rootScope.$on('contactTagDeleted', (e, val) => {
            if (!val.contactIds || includes(this.contact.id, val.contactIds)) {
                this.contact.tag_list = pull(val.tag, this.contact.tag_list);
            }
        });
        this.watcher2 = this.$rootScope.$on('contactTagsAdded', (e, val) => {
            if (!val.contactIds || includes(this.contact.id, val.contactIds)) {
                this.contact.tag_list = union(this.contact.tag_list, val.tags);
            }
        });
    }
    $onDestroy() {
        this.watcher();
        this.watcher2();
    }
    hasSendNewsletterError() {
        if (!this.contact.addresses || !this.contact.people) {
            return false;
        }
        const missingAddress = this.contact.addresses.length === 0;
        const missingEmailAddress = flatten(map('email_addresses', this.contact.people)).length === 0;
        switch (this.contact.send_newsletter) {
            case 'Both':
                return missingAddress || missingEmailAddress;
            case 'Physical':
                return missingAddress;
            case 'Email':
                return missingEmailAddress;
        }
        return false;
    }
    toggleCheckbox() {
        this.contacts.selectContact(this.contact.id);
    }
    daysLate() {
        return moment().diff(moment(this.contact.late_at), 'days') || 0;
    }
    expandTags() {
        this.tagsExpanded = !this.tagsExpanded;
    }
    showCaret() {
        return this.isOverflown(document.querySelector(`#tags_list_${this.$scope.$id}`));
    }
}

const Item = {
    controller: ItemController,
    template: require('./item.html'),
    bindings: {
        contact: '=',
        selected: '='
    }
};

import contacts, { ContactsService } from '../../../contacts/contacts.service';
import people, { PeopleService } from '../../../contacts/show/people/people.service';
import users, { UsersService } from '../../../common/users/users.service';

export default angular.module('mpdx.contacts.list.item.component', [
    contacts, people, users
]).component('contactsListItem', Item).name;
