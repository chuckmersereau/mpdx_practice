import 'angular-block-ui';
import * as moment from 'moment';
import * as uuid from 'uuid/v1';
import {
    assign,
    compact,
    concat,
    contains,
    curry,
    defaultTo,
    find,
    get,
    map,
    pull,
    sumBy,
    toNumber,
    values
} from 'lodash/fp';
import { StateParams, StateService } from '@uirouter/core';
import alerts, { AlertsService } from '../../../common/alerts/alerts.service';
import api, { ApiService } from '../../../common/api/api.service';
import appeals, { AppealsService } from '../../../tools/appeals/appeals.service';
import appealsShow, { AppealsShowService } from './show.service';
import contacts, { ContactsService } from '../../../contacts/contacts.service';
import createPatch from '../../../common/fp/createPatch';
import donations, { DonationsService } from '../../../reports/donations/donations.service';
import exportContacts, { ExportContactsService } from '../../../contacts/list/exportContacts/export.service';
import fixed from '../../../common/fp/fixed';
import isNilOrEmpty from '../../../common/fp/isNilOrEmpty';
import joinComma from '../../../common/fp/joinComma';
import mailchimp, { MailchimpService } from '../../../preferences/integrations/mailchimp/mailchimp.service';
import modal, { ModalService } from '../../../common/modal/modal.service';
import serverconstants, { ServerConstantsService } from '../../../common/serverConstants/serverConstants.service';
import tasks, { TasksService } from '../../../tasks/tasks.service';
import uiRouter from '@uirouter/angularjs';

interface ICustomRootScope extends ng.IRootScopeService {
    pageTitle: string;
}

class AppealController {
    activeTab: string;
    appeal: any;
    blockUIGiven: IBlockUIService;
    blockUIReceived: IBlockUIService;
    blockUICommitted: IBlockUIService;
    blockUIAsking: IBlockUIService;
    blockUIExcluded: IBlockUIService;
    contactsNotGiven: any;
    contactsNotGivenPage: number;
    currency: any;
    data: any;
    dataInitialState: any;
    disableAccountListEvent: any;
    donationsSum: string;
    excludedContacts: any;
    excludedContactsPage: number;
    mailchimpListId: string;
    moment: any;
    percentageRaised: number;
    pledgesNotProcessed: any;
    pledgesNotProcessedPage: number;
    pledgesNotReceived: any;
    pledgesNotReceivedPage: number;
    pledgesProcessed: any;
    pledgesProcessedPage: number;
    reasons: any;
    selectedContactIds: string[];
    watcher: any;
    constructor(
        private $log: ng.ILogService,
        private $q: ng.IQService,
        private $rootScope: ICustomRootScope,
        private $state: StateService,
        private $stateParams: StateParams,
        blockUI: IBlockUIService,
        private gettext: ng.gettext.gettextFunction,
        private alerts: AlertsService,
        private api: ApiService,
        private appeals: AppealsService,
        private appealsShow: AppealsShowService,
        private contacts: ContactsService,
        private donations: DonationsService,
        private exportContacts: ExportContactsService,
        private mailchimp: MailchimpService,
        private modal: ModalService,
        private serverConstants: ServerConstantsService,
        private tasks: TasksService
    ) {
        this.moment = moment;

        this.appeal = null;
        this.blockUIGiven = blockUI.instances.get('appealShow');
        this.blockUIReceived = blockUI.instances.get('appealsReceived');
        this.blockUICommitted = blockUI.instances.get('appealsCommitted');
        this.blockUIAsking = blockUI.instances.get('appealsAsking');
        this.blockUIExcluded = blockUI.instances.get('appealsExcluded');
        this.selectedContactIds = [];
        this.contactsNotGivenPage = 1;
        this.excludedContactsPage = 1;
        this.pledgesNotReceivedPage = 1;
        this.pledgesNotProcessedPage = 1;
        this.pledgesProcessedPage = 1;
        this.activeTab = 'given';
    }
    $onInit(): ng.IPromise<void> {
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
            gave_more_than_pledged_range: this.gettext('May have given a special gift in the last 3 months'),
            started_giving_range: this.gettext('May have joined my team in the last 3 months'),
            pledge_amount_increased_range: this.gettext('May have increased their giving in the last 3 months'),
            stopped_giving_range: this.gettext('May have stopped giving for the last 2 months'),
            no_appeals: this.gettext('"Send Appeals?" set to No')
        };

        return this.refreshLists().then(() => {
            this.donationsSum = fixed(2,
                sumBy('amount', this.pledgesNotReceived)
                + sumBy('amount', this.pledgesNotProcessed)
                + sumBy('amount', this.pledgesProcessed)
            );
            this.percentageRaised = toNumber(this.donationsSum) / this.data.amount * 100;
        });
    }
    $onDestroy(): void {
        this.watcher();
        this.disableAccountListEvent();
    }
    getContactsNotGiven(page: number = this.contactsNotGivenPage): ng.IPromise<void> {
        this.blockUIAsking.start();
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
        }).then((data: any) => {
            /* istanbul ignore next */
            this.$log.debug(`contacts not given page ${page}`, data);
            this.contactsNotGiven = this.fixPledgeAmount(data);
            this.contactsNotGiven.meta = data.meta;
            this.contactsNotGivenPage = page;
            this.blockUIAsking.reset();
        });
    }
    getPledgesNotReceived(page: number = this.pledgesNotReceivedPage): ng.IPromise<void> {
        this.blockUICommitted.start();
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
        }).then((data: any) => {
            /* istanbul ignore next */
            this.$log.debug(`pledges not received page ${page}`, data);
            this.pledgesNotReceived = this.fixPledgeAmount(data);
            this.pledgesNotReceived.meta = data.meta;
            this.pledgesNotReceivedPage = page;
            this.blockUICommitted.reset();
        });
    }
    getPledgesNotProcessed(page: number = this.pledgesNotProcessedPage): ng.IPromise<void> {
        this.blockUIReceived.start();
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
        }).then((data: any) => {
            /* istanbul ignore next */
            this.$log.debug(`pledges received not processed page ${page}`, data);
            this.pledgesNotProcessed = this.fixPledgeAmount(data);
            this.pledgesNotProcessed.meta = data.meta;
            this.pledgesNotProcessedPage = page;
            this.blockUIReceived.reset();
        });
    }
    getPledgesProcessed(page: number = this.pledgesProcessedPage): ng.IPromise<void> {
        this.blockUIGiven.start();
        return this.api.get(`account_lists/${this.api.account_list_id}/pledges`, {
            include: 'contact,donations',
            page: page,
            per_page: 20,
            fields: {
                contacts: 'name',
                donations: 'appeal_amount,converted_appeal_amount,currency,converted_currency,donation_date'
            },
            filter: {
                appeal_id: this.appeal.id,
                status: 'processed'
            },
            sort: 'contact.name'
        }).then((data: any) => {
            /* istanbul ignore next */
            this.$log.debug(`pledges processed page ${page}`, data);
            const fixedData = this.fixPledgeAmount(data);
            this.pledgesProcessed = this.addSymbols(fixedData);
            this.pledgesProcessed.meta = data.meta;
            this.pledgesProcessedPage = page;
            this.blockUIGiven.reset();
        });
    }
    fixPledgeAmount(contacts: any): any[] {
        return map((ref) => assign(ref, {
            contact: assign(ref.contact, {
                pledge_amount: fixed(2, defaultTo(0, ref.contact.pledge_amount))
            })
        }), contacts);
    }
    addSymbols(data: any[]): any[] {
        return map((ref) => assign(ref, {
            donations: this.getCurrencySymbols(ref.donations)
        }), data);
    }
    getCurrencySymbols(donations: any): any[] {
        return map((donation) => {
            return assign(donation, {
                symbol: this.getCurrencySymbolFromCode(donation.currency),
                converted_symbol: this.getCurrencySymbolFromCode(donation.converted_currency)
            });
        }, donations);
    }
    getCurrencyFromCode(code: string): any {
        return find({ code: code }, this.serverConstants.data.pledge_currencies);
    }
    getCurrencySymbolFromCode(code: string): string {
        const currency = this.getCurrencyFromCode(code);
        return get('symbol', currency);
    }
    changeGoal(): ng.IPromise<void> {
        return this.save().then(() => {
            this.changePercentage();
        });
    }
    changePercentage(): void {
        this.percentageRaised = toNumber(this.donationsSum) / this.appeal.amount * 100;
    }
    save(): ng.IPromise<any> {
        let patch: any = createPatch(this.dataInitialState, this.appeal);
        delete patch.contacts;
        delete patch.donations;
        this.$log.debug('appeal save', patch);
        const successMessage = this.gettext('Appeal saved successfully');
        const errorMessage = this.gettext('Unable to save appeal');
        return this.api.put(`appeals/${this.appeal.id}`, patch, successMessage, errorMessage);
    }
    contactSearch(keyword: string): ng.IPromise<any> {
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
    onContactSelected(
        contact: any,
        successMessage: string = this.gettext('Contact successfully added to appeal'),
        errorMessage: string = this.gettext('Unable to add contact to appeal')
    ): ng.IPromise<any> {
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
            type: 'appeal_contacts',
            successMessage: successMessage,
            errorMessage: errorMessage
        }).then(() => {
            this.getContactsNotGiven();
        });
    }
    removeContact(contact: any): ng.IPromise<void> {
        const message = this.gettext('Are you sure you wish to remove this contact from the appeal?');
        return this.modal.confirm(message).then(() => {
            return this.appeals.removeContact(this.appeal.id, contact.id).then(() => {
                this.refreshLists();
            });
        });
    }
    addExcludedContact(rel: any): ng.IPromise<void> {
        return this.removeExcludedContact(rel.id).then(() => {
            const successMessage = this.gettext('Excluded contact successfully added to appeal');
            const errorMessage = this.gettext('Unable to add excluded contact to appeal');
            return this.onContactSelected(rel.contact, successMessage, errorMessage).then(() => {
                this.getExcludedContacts();
                this.getContactsNotGiven();
            });
        });
    }
    removeExcludedContact(id: string): ng.IPromise<any> {
        return this.api.delete(`appeals/${this.appeal.id}/excluded_appeal_contacts/${id}`);
    }
    selectAll(): void {
        if (this.activeTab === 'given') {
            this.selectAllPledges('processed');
        } else if (this.activeTab === 'received') {
            this.selectAllPledges('received_not_processed');
        } else if (this.activeTab === 'committed') {
            this.selectAllPledges('not_received');
        } else if (this.activeTab === 'asking') {
            this.selectAllNotGiven();
        }
    }
    deselectAll(): void {
        this.selectedContactIds = [];
    }
    selectAllPledges(status: string): ng.IPromise<void> {
        return this.api.get(`account_lists/${this.api.account_list_id}/pledges`, {
            include: 'contact',
            per_page: 10000,
            fields: {
                pledges: 'contact',
                contacts: ''
            },
            filter: {
                appeal_id: this.appeal.id,
                status: status
            }
        }).then((appealContacts) => {
            const contactIds = compact(map((appealContact) => {
                if (appealContact.contact) {
                    return appealContact.contact.id;
                }
            }, appealContacts));
            /* istanbul ignore next */
            this.$log.debug(`contact ids for ${status}`, contactIds);
            this.selectedContactIds = contactIds;
        });
    }
    selectAllNotGiven(): ng.IPromise<void> {
        return this.api.get(`appeals/${this.appeal.id}/appeal_contacts`, {
            per_page: 10000,
            include: 'contact',
            filter: {
                pledged_to_appeal: false
            },
            fields: {
                appeal_contacts: 'contact',
                contact: ''
            }
        }).then((appealContacts) => {
            const contactIds = compact(map((appealContact) => {
                if (appealContact.contact) {
                    return appealContact.contact.id;
                }
            }, appealContacts));
            /* istanbul ignore next */
            this.$log.debug('select all contacts not given', contactIds);
            this.selectedContactIds = contactIds;
        });
    }
    selectContact(contactId: string): void {
        this.selectedContactIds = contains(contactId, this.selectedContactIds)
            ? pull(contactId, this.selectedContactIds)
            : concat(this.selectedContactIds, contactId);
    }
    removePledge(pledge: any): ng.IPromise<void> {
        const message = this.gettext('Are you sure you wish to remove this commitment?');
        return this.modal.confirm(message).then(() =>
            this.appeals.removePledge(pledge.id).then(() =>
                this.refreshLists()
            )
        );
    }
    refreshLists(status: string = null): ng.IPromise<void> {
        this.getContactsNotGiven();
        switch (status) {
            case 'processed':
                this.getPledgesProcessed();
                break;
            case 'received_not_processed':
                this.getPledgesNotProcessed();
                break;
            case 'not_received':
                this.getPledgesNotReceived();
                break;
            default:
                this.refreshAllStatuses();
                break;
        }
        return this.reloadAppeal();
    }
    refreshAllStatuses(): ng.IPromise<any> {
        return this.$q.all([
            this.getPledgesProcessed(),
            this.getPledgesNotProcessed(),
            this.getPledgesNotReceived(),
            this.getExcludedContacts()
        ]);
    }
    exportToCSV(): ng.IPromise<void> {
        return this.exportContacts.create({
            account_list_id: this.api.account_list_id,
            ids: joinComma(this.selectedContactIds),
            status: 'active,hidden,null'
        });
    }
    exportMailchimp(): ng.IPromise<void> {
        const alert = curry((message: string) => this.alerts.addAlert(this.gettext(message), 'danger'));
        const result = this.cantExportToMailChimp();
        return result ? alert(result as string) : this.doExportToMailChimp();
    }
    cantExportToMailChimp(): boolean | string {
        return defaultTo(this.isSelectedPrimary(), this.isMailChimpListUndefined());
    }
    isMailChimpListUndefined(): string | null {
        const message = 'No primary Mailchimp list defined. Please select a list in preferences.';
        return isNilOrEmpty(get('primary_list_id', this.mailchimp.data)) ? message : null;
    }
    isSelectedPrimary(): boolean | string {
        const message = 'Please select a list other than your primary Mailchimp list.';
        return get('primary_list_id', this.mailchimp.data) === this.mailchimpListId ? message : false;
    }
    doExportToMailChimp(): ng.IPromise<any> {
        const successMessage = this.gettext('Contact(s) successfully exported to Mailchimp');
        const errorMessage = this.gettext('Unable to add export contact(s) to Mailchimp');
        return this.api.post({
            url: `contacts/export_to_mail_chimp?mail_chimp_list_id=${this.mailchimpListId}`,
            type: 'export_to_mail_chimps',
            data: {
                filter: {
                    account_list_id: this.api.account_list_id,
                    contact_ids: this.selectedContactIds
                }
            },
            doSerialization: false,
            successMessage: successMessage,
            errorMessage: errorMessage
        });
    }
    addPledge(contact: any): void {
        this.modal.open({
            template: require('./addPledge/add.html'),
            controller: 'addPledgeController',
            locals: {
                appealId: this.appeal.id,
                contact: contact
            }
        });
    }
    editPledge(pledge: any): void {
        this.modal.open({
            template: require('./editPledge/edit.html'),
            controller: 'editPledgeController',
            locals: {
                appealId: this.appeal.id,
                pledge: pledge
            }
        });
    }
    getExcludedContacts(page: number = this.excludedContactsPage): ng.IPromise<void> {
        this.blockUIExcluded.start();
        return this.api.get(`appeals/${this.appeal.id}/excluded_appeal_contacts`, {
            include: 'contact',
            fields: {
                contact: 'name,pledge_amount,pledge_currency,pledge_frequency'
            },
            per_page: 20,
            page: page,
            sort: 'contact.name'
        }).then((data: any) => {
            /* istanbul ignore next */
            this.$log.debug(`excluded contacts page ${page}`, data);
            this.excludedContacts = data;
            this.excludedContacts.meta = data.meta;
            this.excludedContactsPage = page;
            this.blockUIExcluded.reset();
        });
    }
    reloadAppeal(): ng.IPromise<void> {
        return this.appealsShow.getAppeal(this.appeal.id).then((data) => {
            this.appeal = data;
        });
    }
    getReasons(rel: any): string[] {
        const keys = values(rel.reasons);
        return map((key) => get(key, this.reasons), keys);
    }
    switchTab(tab: string): void {
        this.activeTab = tab;
        this.deselectAll();
    }
    deleteAppeal(): ng.IPromise<void> {
        const message = this.gettext('You are about to permanently delete this Appeal. This will remove all contacts, and delete all pledges, and progress towards this appeal. Are you sure you want to continue?');
        return this.modal.confirm(message).then(() => {
            const errorMessage = this.gettext('There was an error trying to delete the appeal.');
            return this.api.delete(`appeals/${this.appeal.id}`, undefined, undefined, errorMessage).then(() => {
                this.$state.go('tools.appeals');
            });
        });
    }
}

const Appeal: ng.IComponentOptions = {
    controller: AppealController,
    template: require('./show.html'),
    bindings: {
        data: '<'
    }
};

export default angular.module('tools.mpdx.appeals.show', [
    'blockUI', uiRouter,
    alerts, api, appeals, appealsShow, contacts, donations, exportContacts, mailchimp, modal, serverconstants, tasks
]).component('appealsShow', Appeal).name;
