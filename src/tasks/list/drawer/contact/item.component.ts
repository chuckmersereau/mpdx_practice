import * as bowser from 'bowser';
import * as moment from 'moment';
import { AlertsService } from '../../../../common/alerts/alerts.service';
import { find, get } from 'lodash/fp';
import { ServerConstantsService } from '../../../../common/serverConstants/serverConstants.service';
import contacts, { ContactsService } from '../../../../contacts/contacts.service';
import flattenCompactAndJoin from '../../../../common/fp/flattenCompactAndJoin';
import isOverflown from '../../../../common/fp/isOverflown';
import people, { PeopleService } from '../../../../contacts/show/people/people.service';
import users, { UsersService } from '../../../../common/users/users.service';

class ItemController {
    contact: any;
    currency: any;
    isOverflown: any;
    isSafari: boolean;
    tagsExpanded: boolean;
    constructor(
        private $log: ng.ILogService,
        private $rootScope: ng.IRootScopeService,
        private $scope: ng.IScope,
        private $window: ng.IWindowService,
        private alerts: AlertsService,
        private contacts: ContactsService,
        private gettext: ng.gettext.gettextFunction,
        private people: PeopleService,
        private serverConstants: ServerConstantsService,
        private users: UsersService
    ) {
        this.isOverflown = isOverflown;
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

export default angular.module('mpdx.tasks.list.drawer.contact.component', [
    contacts, people, users
]).component('taskListContact', Item).name;
