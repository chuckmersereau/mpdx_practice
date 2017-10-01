import flatten from 'lodash/fp/flatten';
import includes from 'lodash/fp/includes';
import map from 'lodash/fp/map';
import moment from 'moment';
import pull from 'lodash/fp/pull';
import union from 'lodash/fp/union';

class ItemController {
    constructor(
        $rootScope,
        contacts, people, users
    ) {
        this.$rootScope = $rootScope;
        this.contacts = contacts;
        this.people = people;
        this.users = users;
    }
    $onInit() {
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
        if (this.contacts.isSelected(this.contact.id)) {
            this.contacts.selectContact(this.contact.id);
        } else {
            this.contacts.deSelectContact(this.contact.id);
        }
    }
    daysLate() {
        return moment().diff(moment(this.contact.late_at), 'days') || 0;
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

import contacts from 'contacts/contacts.service';
import people from 'contacts/show/people/people.service';
import users from 'common/users/users.service';

export default angular.module('mpdx.contacts.list.item.component', [
    contacts, people, users
]).component('contactsListItem', Item).name;
