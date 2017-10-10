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
        $log, $q, $rootScope, $state, $stateParams, gettext,
        alerts, api, contacts, donations, mailchimp, modal, serverConstants, tasks,
    ) {
        this.$log = $log;
        this.$q = $q;
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
        this.selectedPledgeIds = [];
    }
    $onInit() {
        /* istanbul ignore next */
        this.$log.debug('appeal', this.data);

        this.dataInitialState = angular.copy(this.data);
        this.currency = this.getCurrencyFromCode(this.data.total_currency);
        this.appeal = assign(this.data, {
            amount: fixed(2, defaultTo(0, this.data.amount))
        });

        this.disableAccountListEvent = this.$rootScope.$on('accountListUpdated', () => {
            this.$state.go('tools.appeals');
        });

        this.getContactsNotGiven();

        return this.$q.all(
            this.getPledgesNotReceived(),
            this.getPledgesNotProcessed(),
            this.getPledgesProcessed()
        ).then(() => {
            this.donationsSum = fixed(2,
                sumBy('amount', this.pledgesNotReceived)
                + sumBy('amount', this.pledgesNotProcessed)
                + sumBy('amount', this.pledgesProcessed)
            );
            this.percentageRaised = this.donationsSum / this.data.amount * 100;
        });
    }
    $onDestroy() {
        this.disableAccountListEvent();
    }
    getContactsNotGiven(page = 1) {
        return this.api.get(`appeals/${this.appeal.id}/appeal_contacts`, {
            page: page,
            per_page: 20,
            include: 'contact',
            filter: {
                pledged_to_appeal: false
            },
            fields: {
                contact: 'name,pledge_amount,pledge_currency,pledge_frequency'
            }
        }).then((data) => {
            /* istanbul ignore next */
            this.$log.debug(`contacts not given page ${page}`, data);
            this.contactsNotGiven = this.fixPledgeAmount(data);
            this.contactsNotGiven.meta = data.meta;
        });
    }
    getPledgesNotReceived(page = 1) {
        return this.api.get(`account_lists/${this.api.account_list_id}/pledges`, {
            include: 'contact',
            page: page,
            per_page: 20,
            fields: {
                contacts: 'name,pledge_amount,pledge_currency,pledge_frequency'
            },
            filter: {
                appeal_id: this.appeal.id,
                status: 'not_received'
            }
        }).then((data) => {
            /* istanbul ignore next */
            this.$log.debug(`pledges not received page ${page}`, data);
            this.pledgesNotReceived = this.fixPledgeAmount(data);
            this.pledgesNotReceived.meta = data.meta;
        });
    }
    getPledgesNotProcessed(page = 1) {
        return this.api.get(`account_lists/${this.api.account_list_id}/pledges`, {
            include: 'contact',
            page: page,
            per_page: 20,
            fields: {
                contacts: 'name,pledge_amount,pledge_currency,pledge_frequency'
            },
            filter: {
                appeal_id: this.appeal.id,
                status: 'received_not_processed'
            }
        }).then((data) => {
            /* istanbul ignore next */
            this.$log.debug(`pledges received not processed page ${page}`, data);
            this.pledgesNotProcessed = this.fixPledgeAmount(data);
            this.pledgesNotProcessed.meta = data.meta;
        });
    }
    getPledgesProcessed(page = 1) {
        return this.api.get(`account_lists/${this.api.account_list_id}/pledges`, {
            include: 'contact',
            page: page,
            per_page: 20,
            fields: {
                contacts: 'name,pledge_amount,pledge_currency,pledge_frequency'
            },
            filter: {
                appeal_id: this.appeal.id,
                status: 'processed'
            }
        }).then((data) => {
            /* istanbul ignore next */
            this.$log.debug(`pledges processed page ${page}`, data);
            this.pledgesProcessed = this.fixPledgeAmount(data);
            this.pledgesProcessed.meta = data.meta;
        });
    }
    fixPledgeAmount(contacts) {
        return map((ref) => assign(ref, {
            contact: assign(ref.contact, {
                pledge_amount: fixed(2, defaultTo(0, ref.contact.pledge_amount))
            })
        }), contacts);
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
        this.selectedPledgeIds = union(this.selectedPledgeIds, map('id', this.pledgesProcessed));
        this.selectedContactIds = union(this.selectedContactIds, map((p) => p.contact.id, this.pledgesProcessed));
    }
    deselectAllGiven() {
        const allGiven = map('id', this.pledgesProcessed);
        const allGivenContacts = map((p) => p.contact.id, this.pledgesProcessed);
        this.selectedPledgeIds = reject((id) => contains(id, allGiven), this.selectedPledgeIds);
        this.selectedContactIds = reject((id) => contains(id, allGivenContacts), this.selectedContactIds);
    }
    selectAllNotReceived() {
        this.selectedPledgeIds = union(this.selectedPledgeIds, map('id', this.pledgesNotReceived));
        this.selectedContactIds = union(this.selectedContactIds, map((p) => p.contact.id, this.pledgesNotReceived));
    }
    deselectAllNotReceived() {
        const allNotGiven = map('id', this.pledgesNotReceived);
        const allNotGivenContacts = map((p) => p.contact.id, this.pledgesNotReceived);
        this.selectedPledgeIds = reject((id) => contains(id, allNotGiven), this.selectedPledgeIds);
        this.selectedContactIds = reject((id) => contains(id, allNotGivenContacts), this.selectedContactIds);
    }
    selectAllNotProcessed() {
        this.selectedPledgeIds = union(this.selectedPledgeIds, map('id', this.pledgesNotProcessed));
        this.selectedContactIds = union(this.selectedContactIds, map((p) => p.contact.id, this.pledgesNotProcessed));
    }
    deselectAllNotProcessed() {
        const allNotProcessed = map('id', this.pledgesNotProcessed);
        const allNotProcessedContacts = map((p) => p.contact.id, this.pledgesNotProcessed);
        this.selectedPledgeIds = reject((id) => contains(id, allNotProcessed), this.selectedPledgeIds);
        this.selectedContactIds = reject((id) => contains(id, allNotProcessedContacts), this.selectedContactIds);
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
    selectPledge(pledge) {
        this.selectedPledgeIds = contains(pledge.id, this.selectedPledgeIds)
            ? pull(pledge.id, this.selectedPledgeIds)
            : concat(this.selectedPledgeIds, pledge.id);
        this.selectedContactIds = contains(pledge.contact.id, this.selectedContactIds)
            ? pull(pledge.contact.id, this.selectedContactIds)
            : concat(this.selectedContactIds, pledge.contact.id);
    }
    removeCommitment(pledge) {
        const message = this.gettext('Are you sure you wish to remove this commitment?');
        return this.modal.confirm(message).then(() =>
            this.api.delete(`account_lists/${this.api.account_list_id}/pledges/${pledge.id}`)
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
        return isNilOrEmpty(get('primary_list_id', this.mailchimp.data)) ? message : null;
    }
    isSelectedPrimary() {
        const message = 'Please select a list other than your primary Mailchimp list.';
        return get('primary_list_id', this.mailchimp.data) === this.mailchimpListId ? message : false;
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
    addCommitment() {
        this.modal.open({
            template: require('./addCommitment/add.html'),
            controller: 'addCommitmentController',
            locals: {
                appealId: this.appeal.id
            },
            resolve: {
                0: () => this.serverConstants.load(['pledge_currencies'])
            }
        });
    }
    editCommitment(pledge) {
        this.modal.open({
            template: require('./editCommitment/edit.html'),
            controller: 'editCommitmentController',
            locals: {
                appealId: this.appeal.id,
                pledge: pledge
            },
            resolve: {
                0: () => this.serverConstants.load(['pledge_currencies'])
            }
        });
    }
    getExcludedContacts(page = 1) {
        return this.api.get(`appeals/${this.appeal.id}/excluded_appeal_contacts`, {
            include: 'contact',
            fields: {
                contact: 'name,pledge_amount,pledge_currency,pledge_frequency'
            },
            per_page: 20,
            page: page // ,
            // sort: 'contact.name'
        }).then((data) => {
            /* istanbul ignore next */
            this.$log.debug(`excluded contacts page ${page}`, data);
            this.excludedContacts = data;
        });
    }
}

const Appeal = {
    controller: AppealController,
    template: require('./show.html'),
    bindings: {
        data: '<'
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