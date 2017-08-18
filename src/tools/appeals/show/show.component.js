import assign from 'lodash/fp/assign';
import concat from 'lodash/fp/concat';
import contains from 'lodash/fp/contains';
import createPatch from 'common/fp/createPatch';
import curry from 'lodash/fp/curry';
import defaultTo from 'lodash/fp/defaultTo';
import find from 'lodash/fp/find';
import get from 'lodash/fp/get';
import isNilOrEmpty from 'common/fp/isNilOrEmpty';
import joinComma from 'common/fp/joinComma';
import map from 'lodash/fp/map';
import moment from 'moment';
import pull from 'lodash/fp/pull';
import reduce from 'lodash/fp/reduce';
import reject from 'lodash/fp/reject';
import sumBy from 'lodash/fp/sumBy';
import union from 'lodash/fp/union';

class AppealController {
    constructor(
        $log, $rootScope, $state, $stateParams, gettext,
        alerts, api, contacts, donations, mailchimp, serverConstants, tasks
    ) {
        this.$log = $log;
        this.$rootScope = $rootScope;
        this.$state = $state;
        this.$stateParams = $stateParams;
        this.alerts = alerts;
        this.api = api;
        this.contacts = contacts;
        this.donations = donations;
        this.gettext = gettext;
        this.mailchimp = mailchimp;
        this.moment = moment;
        this.serverConstants = serverConstants;
        this.tasks = tasks;

        this.appeal = null;
        this.selectedContactIds = [];
    }
    $onInit() {
        this.disable = this.$rootScope.$on('accountListUpdated', () => {
            this.$state.go('tools.appeals');
        });
        this.api.get(`appeals/${this.$stateParams.appealId}`, {
            include: 'contacts,contacts.donor_accounts',
            fields: {
                contacts: 'donor_accounts,name,pledge_amount,pledge_currency,pledge_frequency'
            }
        }).then(data => {
            /* istanbul ignore next */
            this.$log.debug('appeal', data);
            this.appeal = data;
            this.dataInitialState = angular.copy(data);
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
    $onDestroy() {
        this.disable();
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
        const contactsNotGiven = reject(contact => contains(contact.id, allGiven), contacts);
        return map(contact => {
            contact.currency = this.getCurrencyFromCode(contact.pledge_currency);
            return contact;
        }, contactsNotGiven);
    }
    getCurrencyFromCode(code) {
        return find({ code: code }, this.serverConstants.data.pledge_currencies);
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
        let patch = createPatch(this.dataInitialState, this.appeal);
        delete patch.contacts;
        delete patch.donations;
        this.$log.debug('appeal save', patch);
        return this.api.put(`appeals/${this.appeal.id}`, patch).then(data => {
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
        const contactIds = map(donation => donation.contact.id, this.appeal.donations);
        this.selectedContactIds = union(this.selectedContactIds, contactIds);
    }
    deselectAllGiven() {
        const allGiven = map(donation => donation.contact.id, this.appeal.donations);
        this.selectedContactIds = reject(id => contains(id, allGiven), this.selectedContactIds);
    }
    selectAllNotGiven() {
        this.selectedContactIds = union(this.selectedContactIds, map('id', this.contactsNotGiven));
    }
    deselectAllNotGiven() {
        const allNotGiven = map('id', this.contactsNotGiven);
        this.selectedContactIds = reject(id => contains(id, allNotGiven), this.selectedContactIds);
    }
    selectContact(contactId) {
        this.selectedContactIds = contains(contactId, this.selectedContactIds)
            ? pull(contactId, this.selectedContactIds)
            : concat(this.selectedContactIds, contactId);
    }
    addDonation() {
        this.donations.openDonationModal({ appeal: { id: this.appeal.id, name: this.appeal.name } });
    }
    editDonation(donation) {
        this.donations.openDonationModal(assign(donation, { appeal: { id: this.appeal.id, name: this.appeal.name } }));
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
            return contains(contactId, this.selectedContactIds)
                ? concat(result, this.mutateDonation(donation))
                : result;
        }, [], this.appeal.donations);
    }
    getSelectedContactsNotGiven() {
        return reduce((result, contact) => {
            return contains(contact.id, this.selectedContactIds)
                ? concat(result, this.mutateContact(contact))
                : result;
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
    exportMailchimp() {
        const alert = curry(message => this.alerts.addAlert(this.gettext(message), 'danger'));
        const result = this.cantExportToMailChimp();
        return result ? alert(result) : this.doExportToMailChimp();
    }
    cantExportToMailChimp() {
        return defaultTo(this.isSelectedPrimary(), this.isMailChimpListUndefined());
    }
    isMailChimpListUndefined() {
        const message = 'No primary Mailchimp list defined. Please select a list in preferences.';
        return isNilOrEmpty(this.mailchimp.data.primary_list_id) ? message : null;
    }
    isSelectedPrimary() {
        const message = 'Please select a list other than your primary Mailchimp list.';
        return this.mailchimp.data.primary_list_id === this.mailchimpListId ? message : false;
    }
    doExportToMailChimp() {
        return this.api.post({
            url: `contacts/export_to_mail_chimp?mail_chimp_list_id=${this.mailchimpListId}`,
            type: 'export_to_mail_chimps',
            data: {
                filter: {
                    contact_ids: joinComma(this.selectedContactIds)
                }
            },
            doSerialization: false
        }).then(() => {
            this.alerts.addAlert(this.gettext('Contact(s) successfully exported to Mailchimp'));
        }).catch(ex => {
            this.alerts.addAlert(this.gettext('Unable to add export contact(s) to Mailchimp'), 'danger');
            throw ex;
        });
    }
}

const Appeal = {
    controller: AppealController,
    template: require('./show.html')
};

import contacts from 'contacts/contacts.service';
import donations from 'reports/donations/donations.service';
import mailchimp from 'preferences/integrations/mailchimp/mailchimp.service';
import tasks from 'tasks/tasks.service';
import uiRouter from '@uirouter/angularjs';

export default angular.module('tools.mpdx.appeals.show', [
    uiRouter,
    contacts, donations, mailchimp, tasks
]).component('appealsShow', Appeal).name;