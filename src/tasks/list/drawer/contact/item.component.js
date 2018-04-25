import flattenCompactAndJoin from 'common/fp/flattenCompactAndJoin';
import isOverflown from 'common/fp/isOverflown';
import { find, get } from 'lodash/fp';
import bowser from 'bowser';
import moment from 'moment';

class ItemController {
    constructor(
        $log, $rootScope, $scope, $window,
        alerts, contacts, gettext, people, serverConstants, users
    ) {
        this.$log = $log;
        this.$rootScope = $rootScope;
        this.$scope = $scope;
        this.$window = $window;
        this.alerts = alerts;
        this.contacts = contacts;
        this.gettext = gettext;
        this.isOverflown = isOverflown;
        this.people = people;
        this.serverConstants = serverConstants;
        this.users = users;
    }
    $onInit() {
        this.tagsExpanded = false;
        this.isSafari = bowser.name === 'Safari';
    }
    $onChanges() {
        const pledgeCurrency = get('pledge_currency', this.contact);
        this.currency = find({ code: pledgeCurrency }, this.serverConstants.data.pledge_currencies);
    }
    daysLate() {
        return moment().diff(moment(this.contact.late_at), 'days') || 0;
    }
    expandTags() {
        this.tagsExpanded = !this.tagsExpanded;
    }
    emailAll() {
        const emails = flattenCompactAndJoin((email) => email, this.contacts.getEmailsFromPeople(this.contact.people));
        if (this.isSafari) {
            this.$window.href = `mailto:${emails}`;
        } else {
            this.$window.open(`mailto:${emails}`);
        }
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
        loaded: '<' // triggers onchange once nested data is loaded
    }
};

import contacts from 'contacts/contacts.service';
import people from 'contacts/show/people/people.service';
import users from 'common/users/users.service';

export default angular.module('mpdx.tasks.list.drawer.contact.component', [
    contacts, people, users
]).component('taskListContact', Item).name;
