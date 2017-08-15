import assign from 'lodash/fp/assign';
import concat from 'lodash/fp/concat';
import contains from 'lodash/fp/contains';
import defaultTo from 'lodash/fp/defaultTo';
import find from 'lodash/fp/find';
import get from 'lodash/fp/get';
// import joinComma from 'common/fp/joinComma';
import map from 'lodash/fp/map';
import moment from 'moment';
import pull from 'lodash/fp/pull';
import reduce from 'lodash/fp/reduce';
import reject from 'lodash/fp/reject';
import sumBy from 'lodash/fp/sumBy';
import union from 'lodash/fp/union';

class AppealController {
    constructor(
        $log, $stateParams, gettext,
        alerts, api, contacts, donations, serverConstants, tasks
    ) {
        this.$log = $log;
        this.$stateParams = $stateParams;
        this.alerts = alerts;
        this.api = api;
        this.contacts = contacts;
        this.donations = donations;
        this.gettext = gettext;
        this.moment = moment;
        this.serverConstants = serverConstants;
        this.tasks = tasks;

        this.appeal = null;
        this.selectedContactIds = [];
    }
    $onInit() {
        this.api.get(`appeals/${this.$stateParams.appealId}`, {
            include: 'contacts,contacts.donor_accounts'
            // fields: {
            //     contacts: 'name'
            // }
        }).then(data => {
            /* istanbul ignore next */
            this.$log.debug('appeal', data);
            this.appeal = data;
            this.currency = this.getCurrencyFromCode(data.total_currency);
            this.donationsSum = sumBy('converted_amount', data.donations);
            this.percentageRaised = this.donationsSum / data.amount * 100;
            this.donationAccounts = this.getDonationAccounts(data.contacts);
            this.appeal = assign(data, {
                donations: this.mapContactsToDonation(this.appeal.donations, this.donationAccounts)
            });
            this.contactsNotGiven = this.getContactsNotGiven(data.contacts, this.appeal.donations);
            this.$log.debug('donation accounts', this.donationAccounts);
        });
    }
    mapContactsToDonation(donations, donationAccounts) {
        return map(donation => {
            donation.contact = get('contact', get(donation.donor_account_id.toString(), donationAccounts));
            return donation;
        }, donations);
    }
    getDonationAccounts(contacts) {
        return reduce((result, contact) => {
            const accounts = reduce((result, donor) => {
                donor.contact = contact;
                result[donor.account_number] = donor;
                return result;
            }, {}, contact.donor_accounts);
            return assign(result, accounts);
        }, {}, contacts);
    }
    getContactsNotGiven(contacts, donations) {
        const allGiven = reduce((result, value) => {
            const contact = get('contact', value);
            return contact ? concat(result, contact) : result;
        }, [], donations);
        const contactsNotGiven = reject(c => contains(c.id, allGiven), contacts);
        return map(c => {
            c.currency = this.getCurrencyFromCode(c.pledge_currency);
            return c;
        }, contactsNotGiven);
    }
    getCurrencyFromCode(code) {
        return find({code: code}, this.serverConstants.data.pledge_currencies);
    }
    changeGoal() {
        return this.save().then(() => {
            this.changePercentage();
        });
    }
    changePercentage() {
        this.percentageRaised = this.donationsSum / this.appeal.amount * 100;
    }
    save() {
        return this.api.put(`appeals/${this.appeal.id}`, this.appeal).then(data => {
            this.alerts.addAlert(this.gettext('Appeal saved successfully'));
            return data;
        }).catch(ex => {
            this.alerts.addAlert(this.gettext('Unable to save appeal'), 'danger');
            throw ex;
        });
    }
    contactSearch(keyword) {
        // api missing exclude capability
        // const excluded = joinComma(map('id', this.appeal.contacts));
        return this.api.get({
            url: 'contacts',
            data: {
                filter: {
                    account_list_id: this.api.account_list_id,
                    wildcard_search: keyword
                },
                fields: {
                    contacts: 'name'
                },
                per_page: 6,
                sort: 'name'
            },
            overrideGetAsPost: true
        });
    }
    onContactSelected(contact) {
        return this.api.post(`appeals/${this.appeal.id}/contacts/${contact.id}`).then(() => {
            this.alerts.addAlert(this.gettext('Contact successfully added to appeal'));
        }).catch(ex => {
            this.alerts.addAlert(this.gettext('Unable to add contact to appeal'), 'danger');
            throw ex;
        });
    }
    selectAllGiven() {
        this.selectedContactIds = union(this.selectedContactIds, map(d => d.contact.id, this.appeal.donations));
    }
    deselectAllGiven() {
        const allGiven = map(d => d.contact.id, this.appeal.donations);
        this.selectedContactIds = reject(c => contains(c, allGiven), this.selectedContactIds);
    }
    selectAllNotGiven() {
        this.selectedContactIds = union(this.selectedContactIds, map('id', this.contactsNotGiven));
    }
    deselectAllNotGiven() {
        const allNotGiven = map('id', this.contactsNotGiven);
        this.selectedContactIds = reject(c => contains(c, allNotGiven), this.selectedContactIds);
    }
    selectContact(contactId) {
        this.selectedContactIds = contains(contactId, this.selectedContactIds) ? pull(contactId, this.selectedContactIds) : concat(this.selectedContactIds, contactId);
    }
    addDonation() {
        this.donations.openDonationModal({appeal: {id: this.appeal.id, name: this.appeal.name}});
    }
    editDonation(donation) {
        this.donations.openDonationModal(assign(donation, {appeal: {id: this.appeal.id, name: this.appeal.name}}));
    }
    exportToCSV() {
        const columnHeaders = [[
            this.gettext('Contact'),
            this.gettext('Commitment'),
            this.gettext('Donations')
        ]];
        const donationContacts = this.getSelectedDonationContacts();
        const contactsNotGiven = this.getSelectedContactsNotGiven();
        const rows = concat(donationContacts, contactsNotGiven);
        return concat(columnHeaders, rows);
    }
    getSelectedDonationContacts() {
        return reduce((result, donation) => {
            const contactId = get('id', donation.contact);
            return contains(contactId, this.selectedContactIds) ? concat(result, this.mutateDonation(donation)) : result;
        }, [], this.appeal.donations);
    }
    getSelectedContactsNotGiven() {
        return reduce((result, contact) => {
            return contains(contact.id, this.selectedContactIds) ? concat(result, this.mutateContact(contact)) : result;
        }, [], this.contactsNotGiven);
    }
    mutateDonation(donation) {
        const contact = defaultTo({}, donation.contact);
        const name = defaultTo('', contact.name);
        const pledge = defaultTo('', contact.pledge_amount);
        const amount = defaultTo('', donation.amount);
        const currency = defaultTo('USD', donation.currency);
        const date = defaultTo('', donation.donation_date);
        const field = `${amount} ${currency} ${date}`;
        return [[name, pledge, field]];
    }
    mutateContact(contact) {
        const name = defaultTo('', contact.name);
        const pledge = defaultTo('', contact.pledge_amount);
        const currency = defaultTo('$', contact.currency.symbol);
        const frequency = defaultTo('', get('value', this.serverConstants.getPledgeFrequency(contact.pledge_frequency)));
        const field = `${currency}${pledge} ${frequency}`;
        return [[name, field]];
    }
}

const Appeal = {
    controller: AppealController,
    template: require('./show.html')
};

import contacts from 'contacts/contacts.service';
import donations from 'reports/donations/donations.service';
import tasks from 'tasks/tasks.service';
import uiRouter from '@uirouter/angularjs';

export default angular.module('tools.mpdx.appeals.show', [
    uiRouter,
    contacts, donations, tasks
]).component('appealsShow', Appeal).name;