import * as uuid from 'uuid/v1';
import { assign, concat, defaultTo, eq, get, map, round, sumBy } from 'lodash/fp';
import { StateService } from '@uirouter/core';
import api, { ApiService } from '../../../common/api/api.service';
import contacts, { ContactsService } from '../../contacts.service';
import contactsTags, { ContactsTagsService } from '../../sidebar/filter/tags/tags.service';
import locale, { LocaleService } from '../../../common/locale/locale.service';
import modal, { ModalService } from '../../../common/modal/modal.service';
import serverConstants from '../../../common/serverConstants/serverConstants.service';
import timeZone, { TimeZoneService } from '../../../common/timeZone/timeZone.service';
import users, { UsersService } from '../../../common/users/users.service';

class ContactDetailsController {
    contact: any;
    giving_method: string;
    languages: any[];
    last_donation: any;
    lifetime_donations: number;
    referrer: any;
    referrerName: string;
    translations: any;
    constructor(
        private $log: ng.ILogService,
        private $rootScope: ng.IRootScopeService,
        private $state: StateService,
        private gettextCatalog: ng.gettext.gettextCatalog,
        private api: ApiService,
        private contactsTags: ContactsTagsService,
        private contacts: ContactsService,
        private locale: LocaleService,
        private modal: ModalService,
        private timeZone: TimeZoneService,
        private users: UsersService
    ) {
        this.languages = locale.getLocalesMap();
    }
    $onInit() {
        const yes = this.gettextCatalog.getString('Yes');
        const no = this.gettextCatalog.getString('No');
        this.translations = {
            no_appeals: [
                { key: false, value: yes },
                { key: true, value: no }
            ],
            no_gift_aid: [
                { key: false, value: yes },
                { key: true, value: no }
            ],
            magazine: [
                { key: true, value: yes },
                { key: false, value: no }
            ],
            pledge_received: [
                { key: true, value: yes },
                { key: false, value: no }
            ]
        };
        this.users.listOrganizationAccounts();
        this.$rootScope.$on('accountListUpdated', () => {
            this.users.listOrganizationAccounts(true);
        });
    }
    $onChanges() {
        this.last_donation = this.contact.last_donation ? round(this.contact.last_donation.amount) : this.gettextCatalog.getString('Never');
        this.giving_method = defaultTo(this.gettextCatalog.getString('None'), get('last_donation.payment_method', this.contact));
        this.lifetime_donations = round(defaultTo(0, this.contact.lifetime_donations));

        if (!this.referrer) {
            this.referrer = get('contacts_that_referred_me[0].id', this.contact);
            if (this.referrer) {
                return this.getName(this.referrer).then((data: any) => {
                    this.referrerName = data.name;
                });
            }
        }
    }
    addPartnerAccount() {
        this.contact.donor_accounts.push({ id: uuid(), organization: { id: this.users.organizationAccounts[0].organization.id }, account_number: '' });
    }
    onContactSelected(params) {
        if (!params) {
            return;
        }
        this.referrer = params.id;
        this.referrerName = params.name;
        this.save();
    }
    saveWithEmptyCheck(property) {
        this.contact[property] = defaultTo('', this.contact[property]);
        this.save();
    }
    save() {
        if (this.referrer && this.referrer !== get('contacts_that_referred_me[0].id', this.contact)) {
            return this.changeReferrer();
        } else if (!this.referrer && get(this.contact, 'contacts_that_referred_me[0].id')) {
            return this.addReferrer();
        } else {
            return this.contacts.saveCurrent();
        }
    }
    addReferrer() {
        this.contact.contact_referrals_to_me = this.destroyReferrals(this.contact.contact_referrals_to_me);
        return this.contacts.saveCurrent().then(() => {
            this.contact.contacts_that_referred_me = [];
        });
    }
    changeReferrer() {
        // wipe out old referrals
        this.contact.contact_referrals_to_me = this.destroyReferrals(this.contact.contact_referrals_to_me);

        // awful, but it just won't serialize all the custom types
        const destroyOld = map((referee) => {
            return assign({ type: 'contact_referrals' }, referee);
        }, this.contact.contact_referrals_to_me);
        const newId = uuid();
        const newRelationship = { type: 'contact_referrals', id: newId };
        const relationshipData = concat(destroyOld, newRelationship);
        const request = {
            'included': [
                {
                    'type': 'contact_referrals',
                    'id': newId,
                    'relationships': {
                        'referred_by': {
                            'data': {
                                'type': 'contacts',
                                'id': this.referrer
                            }
                        }
                    }
                }
            ],
            'data': {
                'type': 'contacts',
                'id': this.contact.id,
                'attributes': {
                    'overwrite': true
                },
                'relationships': {
                    'contact_referrals_to_me': {
                        'data': relationshipData
                    }
                }
            }
        };
        const errorMessage = this.gettextCatalog.getString('Unable to save changes.');
        const successMessage = this.gettextCatalog.getString('Changes saved successfully.');
        return this.api.put({
            url: `contacts/${this.contact.id}`,
            data: request,
            doSerialization: false,
            errorMessage: errorMessage,
            successMessage: successMessage
        }).then(() => {
            this.contact.contacts_that_referred_me = [{ id: this.referrer }];
        });
    }
    destroyReferrals(referrals) {
        return map((referee) => {
            return { id: referee.id, _destroy: 1 };
        }, referrals);
    }
    getName(id) {
        return this.api.get(`contacts/${id}`, {
            fields: {
                contacts: 'name'
            }
        });
    }
    showGiftAid() {
        return (sumBy as any)((organizationAccount: any) => {
            if (!organizationAccount.organization || !organizationAccount.organization.gift_aid_percentage) {
                return false;
            }
            return parseFloat(organizationAccount.organization.gift_aid_percentage);
        }, this.users.organizationAccounts) > 0;
    }
    removeReferrer() {
        this.contact.contact_referrals_to_me[0]._destroy = 1;
        return this.contacts.saveCurrent().then(() => {
            this.referrer = null;
            this.referrerName = null;
        });
    }
    removeNextAsk() {
        this.contacts.current.next_ask = null;
        this.contacts.saveCurrent();
    }
    remove(): ng.IPromise<void> {
        const cantDelete = this.contact.lifetime_donations > 0;
        return cantDelete ? this.cantDeleteModal() : this.openDeleteModal();
    }
    private openDeleteModal(): ng.IPromise<void> {
        return this.modal.open({
            template: require('./removeContact/modal.html'),
            controller: 'removeContactModalController'
        });
    }
    private cantDeleteModal(): ng.IPromise<void> {
        return this.modal.open({
            template: require('./removeContact/hide.html'),
            controller: 'removeContactModalController'
        });
    }
}
const Details = {
    controller: ContactDetailsController,
    template: require('./details.html'),
    bindings: {
        donorAccounts: '<', // for change detection
        contact: '='
    }
};

export default angular.module('mpdx.contacts.show.details.component', [
    api, contactsTags, contacts, locale, modal, serverConstants, timeZone, users
]).component('contactDetails', Details).name;
