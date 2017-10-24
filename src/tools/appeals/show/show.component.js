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
import reject from 'lodash/fp/reject';
import sumBy from 'lodash/fp/sumBy';
import union from 'lodash/fp/union';
import uuid from 'uuid/v1';
import values from 'lodash/fp/values';

class AppealController {
    constructor(
        $log, $q, $rootScope, $state, $stateParams, gettext,
        alerts, api, contacts, donations, exportContacts, mailchimp, modal, serverConstants, tasks,
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
        this.exportContacts = exportContacts;
        this.gettext = gettext;
        this.mailchimp = mailchimp;
        this.modal = modal;
        this.moment = moment;
        this.serverConstants = serverConstants;
        this.tasks = tasks;

        this.appeal = null;
        this.selectedContactIds = [];
        this.selectedPledgeIds = [];
        this.contactsNotGivenPage = 1;
        this.excludedContactsPage = 1;
        this.pledgesNotReceivedPage = 1;
        this.pledgesNotProcessedPage = 1;
        this.pledgesProcessedPage = 1;
        this.activeTab = 'given';
    }
    $onInit() {
        /* istanbul ignore next */
        this.$log.debug('appeal', this.data);
        this.dataInitialState = angular.copy(this.data);
        this.currency = this.getCurrencyFromCode(this.data.total_currency);
        this.appeal = assign(this.data, {
            amount: fixed(2, defaultTo(0, this.data.amount)),
            pledges_amount_processed: fixed(2, defaultTo(0, this.data.pledges_amount_processed))
        });
        this.$rootScope.pageTitle = `${this.gettext('Appeal')} | ${this.appeal.name}`;

        this.disableAccountListEvent = this.$rootScope.$on('accountListUpdated', () => {
            this.$state.go('tools.appeals');
        });

        this.watcher = this.$rootScope.$on('pledgeAdded', (e, pledge) => {
            this.refreshLists(get('status', pledge));
        });

        this.reasons = {
            gave_more_than_pledged_within: this.gettext('May have given a special gift in the last 3 months'),
            started_giving_within: this.gettext('May have joined my team in the last 3 months'),
            pledge_amount_increased_within: this.gettext('May have increased their giving in the last 3 months'),
            stopped_giving_within: this.gettext('May have stopped giving for the last 2 months'),
            no_appeals: this.gettext('"Send Appeals?" set to No')
        };

        return this.refreshLists().then(() => {
            this.donationsSum = fixed(2,
                sumBy('amount', this.pledgesNotReceived)
                + sumBy('amount', this.pledgesNotProcessed)
                + sumBy('amount', this.pledgesProcessed)
            );
            this.percentageRaised = this.donationsSum / this.data.amount * 100;
        });
    }
    $onDestroy() {
        this.watcher();
        this.disableAccountListEvent();
    }
    getContactsNotGiven(page = this.contactsNotGivenPage) {
        return this.api.get(`appeals/${this.appeal.id}/appeal_contacts`, {
            page: page,
            per_page: 20,
            include: 'contact',
            filter: {
                pledged_to_appeal: false
            },
            fields: {
                contact: 'name,pledge_amount,pledge_currency,pledge_frequency'
            },
            sort: 'contact.name'
        }).then((data) => {
            /* istanbul ignore next */
            this.$log.debug(`contacts not given page ${page}`, data);
            this.contactsNotGiven = this.fixPledgeAmount(data);
            this.contactsNotGiven.meta = data.meta;
            this.contactsNotGivenPage = page;
        });
    }
    getPledgesNotReceived(page = this.pledgesNotReceivedPage) {
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
            },
            sort: 'contact.name'
        }).then((data) => {
            /* istanbul ignore next */
            this.$log.debug(`pledges not received page ${page}`, data);
            this.pledgesNotReceived = this.fixPledgeAmount(data);
            this.pledgesNotReceived.meta = data.meta;
            this.pledgesNotReceivedPage = page;
        });
    }
    getPledgesNotProcessed(page = this.pledgesNotProcessedPage) {
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
            },
            sort: 'contact.name'
        }).then((data) => {
            /* istanbul ignore next */
            this.$log.debug(`pledges received not processed page ${page}`, data);
            this.pledgesNotProcessed = this.fixPledgeAmount(data);
            this.pledgesNotProcessed.meta = data.meta;
            this.pledgesNotProcessedPage = page;
        });
    }
    getPledgesProcessed(page = this.pledgesProcessedPage) {
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
            },
            sort: 'contact.name'
        }).then((data) => {
            /* istanbul ignore next */
            this.$log.debug(`pledges processed page ${page}`, data);
            this.pledgesProcessed = this.fixPledgeAmount(data);
            this.pledgesProcessed.meta = data.meta;
            this.pledgesProcessedPage = page;
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
        return this.api.post({
            url: `appeals/${this.appeal.id}/appeal_contacts`,
            data: {
                id: uuid(),
                appeal: {
                    id: this.appeal.id
                },
                contact: {
                    id: contact.id
                }
            },
            type: 'appeal_contacts'
        }).then(() => {
            this.alerts.addAlert(this.gettext('Contact successfully added to appeal'));
            this.getContactsNotGiven();
        }).catch((ex) => {
            this.alerts.addAlert(this.gettext('Unable to add contact to appeal'), 'danger');
            throw ex;
        });
    }
    removeContact(contact) {
        const message = this.gettext('Are you sure you wish to remove this contact from the appeal?');
        return this.modal.confirm(message).then(() =>
            this.api.delete(`appeals/${this.appeal.id}/appeal_contacts/${contact}`).then(() => {
                this.alerts.addAlert(this.gettext('Contact removed from appeal'));
                this.refreshLists();
            }).catch((ex) => {
                this.alerts.addAlert(this.gettext('Unable to remove contact from appeal'), 'danger');
                throw ex;
            })
        );
    }
    addExcludedContact(rel) {
        return this.removeExcludedContact(rel.id).then(() => {
            this.onContactSelected(rel.contact).then(() => {
                this.getExcludedContacts();
                this.getContactsNotGiven();
            });
        });
    }
    removeExcludedContact(id) {
        return this.api.delete(`appeals/${this.appeal.id}/excluded_appeal_contacts/${id}`);
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
        this.selectedContactIds = union(this.selectedContactIds, map((p) => p.contact.id, this.contactsNotGiven));
    }
    deselectAllNotGiven() {
        const allNotGiven = map((p) => p.contact.id, this.contactsNotGiven);
        this.selectedContactIds = reject((id) => contains(id, allNotGiven), this.selectedContactIds);
    }
    selectAllExcluded() {
        this.selectedContactIds = union(this.selectedContactIds, map((p) => p.contact.id, this.excludedContacts));
    }
    deselectAllExcluded() {
        const excluded = map((p) => p.contact.id, this.excludedContacts);
        this.selectedContactIds = reject((id) => contains(id, excluded), this.selectedContactIds);
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
    removePledge(pledge) {
        const message = this.gettext('Are you sure you wish to remove this commitment?');
        const status = angular.copy(pledge.status);
        return this.modal.confirm(message).then(() =>
            this.api.delete(`account_lists/${this.api.account_list_id}/pledges/${pledge.id}`).then(() => {
                this.refreshLists(status);
            })
        );
    }
    refreshLists(status = null) {
        this.getContactsNotGiven();
        switch (status) {
            case 'processed':
                return this.getPledgesProcessed();
            case 'received_not_processed':
                return this.getPledgesNotProcessed();
            case 'not_received':
                return this.getPledgesNotReceived();
            default:
                return this.refreshAllStatuses();
        }
    }
    refreshAllStatuses() {
        return this.$q.all(
            this.getPledgesProcessed(),
            this.getPledgesNotProcessed(),
            this.getPledgesNotReceived(),
            this.getExcludedContacts()
        );
    }
    exportToCSV() {
        const params = {
            data: {
                filter: {
                    account_list_id: this.api.account_list_id,
                    ids: joinComma(this.selectedContactIds),
                    status: 'active,hidden,null'
                }
            },
            doDeSerialization: false,
            overrideGetAsPost: true
        };
        return this.exportContacts.primaryCSVLink(params);
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
    addPledge(contact) {
        this.modal.open({
            template: require('./addPledge/add.html'),
            controller: 'addPledgeController',
            locals: {
                appealId: this.appeal.id,
                contact: contact
            }
        });
    }
    editPledge(pledge) {
        this.modal.open({
            template: require('./editPledge/edit.html'),
            controller: 'editPledgeController',
            locals: {
                appealId: this.appeal.id,
                pledge: pledge
            }
        });
    }
    getExcludedContacts(page = this.excludedContactsPage) {
        return this.api.get(`appeals/${this.appeal.id}/excluded_appeal_contacts`, {
            include: 'contact',
            fields: {
                contact: 'name,pledge_amount,pledge_currency,pledge_frequency'
            },
            per_page: 20,
            page: page,
            sort: 'contact.name'
        }).then((data) => {
            /* istanbul ignore next */
            this.$log.debug(`excluded contacts page ${page}`, data);
            this.excludedContacts = data;
            this.excludedContacts.meta = data.meta;
            this.excludedContactsPage = page;
        });
    }
    getReasons(rel) {
        const keys = values(rel.reasons);
        return map((key) => get(key, this.reasons), keys);
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
import exportContacts from 'contacts/list/exportContacts/export.service';
import mailchimp from 'preferences/integrations/mailchimp/mailchimp.service';
import tasks from 'tasks/tasks.service';
import uiRouter from '@uirouter/angularjs';

export default angular.module('tools.mpdx.appeals.show', [
    uiRouter,
    contacts, donations, exportContacts, mailchimp, tasks
]).component('appealsShow', Appeal).name;
