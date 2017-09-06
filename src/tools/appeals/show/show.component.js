import assign from 'lodash/fp/assign';
import concat from 'lodash/fp/concat';
import contains from 'lodash/fp/contains';
import createPatch from 'common/fp/createPatch';
import curry from 'lodash/fp/curry';
import defaultTo from 'lodash/fp/defaultTo';
import find from 'lodash/fp/find';
import fixed from 'common/fp/fixed';
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
        alerts, api, contacts, donations, mailchimp, modal, serverConstants, tasks,
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
        this.modal = modal;
        this.moment = moment;
        this.serverConstants = serverConstants;
        this.tasks = tasks;

        this.appeal = null;
        this.selectedContactIds = [];
    }
    $onInit() {
        /* istanbul ignore next */
        this.$log.debug('appeal', this.data);
        /* istanbul ignore next */
        this.$log.debug('appeal contacts', this.contactsData);

        this.dataInitialState = angular.copy(this.data);
        this.currency = this.getCurrencyFromCode(this.data.total_currency);
        this.donationsSum = this.sumDonations(this.data.donations);
        this.percentageRaised = this.donationsSum / this.data.amount * 100;
        this.contactsData.contacts = this.fixPledgeAmount(this.contactsData.contacts);
        this.appeal = assign(this.data, {
            amount: fixed(2, defaultTo(0, this.data.amount)),
            donations: this.mutateDonations(this.data.donations, this.contactsData.contacts)
        });
        this.contactsNotGiven = this.getContactsNotGiven(this.contactsData.contacts, this.appeal.donations);

        this.disableAccountListEvent = this.$rootScope.$on('accountListUpdated', () => {
            this.$state.go('tools.appeals');
        });
    }
    $onDestroy() {
        this.disableAccountListEvent();
    }
    sumDonations(donations) {
        return fixed(2, sumBy((donation) => parseFloat(donation.converted_amount), donations));
    }
    fixPledgeAmount(contacts) {
        return map((contact) => assign(contact, {
            pledge_amount: fixed(2, defaultTo(0, contact.pledge_amount))
        }), contacts);
    }
    mutateDonations(donations, contacts) {
        return map((donation) => {
            donation.contact = find({ id: donation.contact.id }, contacts);
            donation.amount = fixed(2, defaultTo(0, donation.amount));
            return donation;
        }, donations);
    }
    getContactsNotGiven(contacts, donations) {
        const allGiven = reduce((result, value) => {
            const contact = get('id', value.contact);
            return contact ? concat(result, contact) : result;
        }, [], donations);
        const contactsNotGiven = reject((contact) => contains(contact.id, allGiven), contacts);
        return map((contact) => {
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
        return this.api.put(`appeals/${this.appeal.id}`, patch).then((data) => {
            this.alerts.addAlert(this.gettext('Appeal saved successfully'));
            return data;
        }).catch((ex) => {
            this.alerts.addAlert(this.gettext('Unable to save appeal'), 'danger');
            throw ex;
        });
    }
    contactSearch(keyword) {
        // api missing exclude capability
        return this.api.get({
            url: 'contacts',
            data: {
                filter: {
                    appeal: this.appeal.id,
                    reverse_appeal: true,
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
        }).catch((ex) => {
            this.alerts.addAlert(this.gettext('Unable to add contact to appeal'), 'danger');
            throw ex;
        });
    }
    addContact(contact) {
        return this.api.post(`appeals/${this.appeal.id}/contacts/${contact.id}`).then(() => {
            this.alerts.addAlert(this.gettext('Contact added to appeal'));
        }).catch((ex) => {
            this.alerts.addAlert(this.gettext('Unable to add contact to appeal'), 'danger');
            throw ex;
        });
    }
    removeContact(contact) {
        const message = this.gettext('Are you sure you wish to remove this contact from the appeal?');
        return this.modal.confirm(message).then(() =>
            this.api.delete(`appeals/${this.appeal.id}/contacts/${contact.id}`).then(() => {
                this.alerts.addAlert(this.gettext('Contact removed from appeal'));
            }).catch((ex) => {
                this.alerts.addAlert(this.gettext('Unable to remove contact from appeal'), 'danger');
                throw ex;
            })
        );
    }
    selectAllGiven() {
        const contactIds = map((donation) => donation.contact.id, this.appeal.donations);
        this.selectedContactIds = union(this.selectedContactIds, contactIds);
    }
    deselectAllGiven() {
        const allGiven = map((donation) => donation.contact.id, this.appeal.donations);
        this.selectedContactIds = reject((id) => contains(id, allGiven), this.selectedContactIds);
    }
    selectAllNotGiven() {
        this.selectedContactIds = union(this.selectedContactIds, map('id', this.contactsNotGiven));
    }
    deselectAllNotGiven() {
        const allNotGiven = map('id', this.contactsNotGiven);
        this.selectedContactIds = reject((id) => contains(id, allNotGiven), this.selectedContactIds);
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
    removeDonation(donation) {
        const message = this.gettext('Are you sure you wish to remove this donation?');
        return this.modal.confirm(message).then(() =>
            this.donations.delete(donation)
        );
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
        const alert = curry((message) => this.alerts.addAlert(this.gettext(message), 'danger'));
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
        }).catch((ex) => {
            this.alerts.addAlert(this.gettext('Unable to add export contact(s) to Mailchimp'), 'danger');
            throw ex;
        });
    }
}

const Appeal = {
    controller: AppealController,
    template: require('./show.html'),
    bindings: {
        data: '<',
        contactsData: '<'
    }
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