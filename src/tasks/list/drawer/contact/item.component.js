import createPatch from '../../../../common/fp/createPatch';
import flattenCompactAndJoin from '../../../../common/fp/flattenCompactAndJoin';
import { defaultTo, find, get } from 'lodash/fp';
import bowser from 'bowser';
import moment from 'moment';

class ItemController {
    constructor(
        $log, $rootScope, $window,
        alerts, contacts, gettext, people, serverConstants, users
    ) {
        this.$log = $log;
        this.$rootScope = $rootScope;
        this.$window = $window;
        this.alerts = alerts;
        this.contacts = contacts;
        this.gettext = gettext;
        this.people = people;
        this.serverConstants = serverConstants;
        this.users = users;
    }
    $onInit() {
        this.tagsExpanded = false;
        this.isSafari = bowser.name === 'Safari';
    }
    $onChanges() {
        this.initialContact = angular.copy(this.contact);
        const lastDonation = get('last_donation', this.contact);
        if (lastDonation) {
            const currency = find({ code: lastDonation.currency }, this.serverConstants.data.pledge_currencies);
            const symbol = get('symbol', currency);
            this.currency = defaultTo(lastDonation.currency, symbol);
        }
    }
    daysLate() {
        return moment().diff(moment(this.contact.late_at), 'days') || 0;
    }
    expandTags() {
        this.tagsExpanded = !this.tagsExpanded;
    }
    save() {
        let patch = createPatch(this.initialContact, this.contact);
        delete patch.people; // task mutation causes change in people
        this.$log.debug('contact patch', patch);

        return this.contacts.save(patch).then(() => {
            this.initialContact = angular.copy(this.contact);
            const message = this.gettext('Changes saved successfully.');
            this.alerts.addAlert(message);
        }).catch((err) => {
            const message = this.gettext('Unable to save changes.');
            this.alerts.addAlert(message, 'danger');
            throw err;
        });
    }
    emailAll() {
        const emails = flattenCompactAndJoin((email) => email, this.contacts.getEmailsFromPeople(this.contact.people));
        if (this.isSafari) {
            this.$window.href = `mailto:${emails}`;
        } else {
            this.$window.open(`mailto:${emails}`);
        }
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
