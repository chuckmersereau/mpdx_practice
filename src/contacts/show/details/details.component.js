import { assign, concat, defaultTo, eq, get, map, round, sumBy } from 'lodash/fp';
import uuid from 'uuid/v1';

class ContactDetailsController {
    constructor(
        $log, $rootScope, gettextCatalog,
        api, contactsTags, contacts, locale, modal, timeZone, users
    ) {
        this.$log = $log;
        this.$rootScope = $rootScope;
        this.api = api;
        this.contacts = contacts;
        this.contactsTags = contactsTags;
        this.gettextCatalog = gettextCatalog;
        this.locale = locale;
        this.modal = modal;
        this.timeZone = timeZone;
        this.users = users;

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
                return this.getName(this.referrer).then((data) => {
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
            return this.onSave();
        }
    }
    addReferrer() {
        this.contact.contact_referrals_to_me = this.destroyReferrals(this.contact.contact_referrals_to_me);
        return this.onSave().then(() => {
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
    onAddressPrimary(addressId) {
        /* istanbul ignore next */
        this.$log.debug('change primary: ', addressId);
        return this.modal.confirm(this.gettextCatalog.getString('This address will be used for your newsletters. Would you like to change to have this address as primary?')).then(() => {
            const addresses = map((address) => {
                address.primary_mailing_address = eq(address.id, addressId);
                return address;
            }, this.contact.addresses);
            const addressPatch = map((address) => {
                return { id: address.id, primary_mailing_address: address.primary_mailing_address };
            }, addresses);
            const successMessage = this.gettextCatalog.getString('Changes saved successfully.');
            const errorMessage = this.gettextCatalog.getString('Unable to save changes.');

            return this.contacts.save(
                { id: this.contacts.current.id, addresses: addressPatch },
                successMessage,
                errorMessage
            );
        });
    }
    getName(id) {
        return this.api.get(`contacts/${id}`, {
            fields: {
                contacts: 'name'
            }
        });
    }
    showGiftAid() {
        return sumBy((organizationAccount) => {
            if (!organizationAccount.organization || !organizationAccount.organization.gift_aid_percentage) {
                return false;
            }
            return parseFloat(organizationAccount.organization.gift_aid_percentage);
        }, this.users.organizationAccounts) > 0;
    }
    removeReferrer() {
        this.contact.contact_referrals_to_me[0]._destroy = 1;
        return this.onSave().then(() => {
            this.referrer = null;
            this.referrerName = null;
        });
    }
    removeNextAsk() {
        this.contacts.current.next_ask = null;
        this.onSave();
    }
}
const Details = {
    controller: ContactDetailsController,
    template: require('./details.html'),
    bindings: {
        donorAccounts: '<', // for change detection
        contact: '=',
        onSave: '&'
    }
};

import api from 'common/api/api.service';
import contacts from 'contacts/contacts.service';
import contactsTags from 'contacts/sidebar/filter/tags/tags.service';
import locale from 'common/locale/locale.service';
import modal from 'common/modal/modal.service';
import serverConstants from 'common/serverConstants/serverConstants.service';
import timeZone from 'common/timeZone/timeZone.service';
import users from 'common/users/users.service';

export default angular.module('mpdx.contacts.show.details.component', [
    api, contactsTags, contacts, locale, modal, serverConstants, timeZone, users
]).component('contactDetails', Details).name;
