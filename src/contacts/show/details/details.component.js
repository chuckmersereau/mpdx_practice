import assign from 'lodash/fp/assign';
import concat from 'lodash/fp/concat';
import defaultTo from 'lodash/fp/defaultTo';
import get from 'lodash/fp/get';
import keys from 'lodash/fp/keys';
import map from 'lodash/fp/map';
import uuid from 'uuid/v1';

class ContactDetailsController {
    alerts;
    contact;
    contacts;
    contactsTags;
    modal;
    onSave;
    referrerName;
    serverConstants;
    users;

    constructor(
        $window, gettextCatalog,
        alerts, api, contactsTags, contacts, locale, modal, serverConstants, users
    ) {
        this.alerts = alerts;
        this.api = api;
        this.contacts = contacts;
        this.contactsTags = contactsTags;
        this.gettextCatalog = gettextCatalog;
        this.locale = locale;
        this.modal = modal;
        this.users = users;

        this.languages = map((locale) => {
            const language = $window.languageMappingList[locale];
            if (language) {
                return {alias: locale, value: `${language.englishName} (${language.nativeName} - ${locale})`};
            } else {
                return {
                    alias: locale,
                    value: `${serverConstants.data.locales[locale].english_name} (${serverConstants.data.locales[locale].native_name} - ${locale})`
                };
            }
        }, keys(serverConstants.data.locales));
    }
    $onChanges() {
        if (this.contact.contacts_that_referred_me && !this.referrer) {
            if (this.contact.contacts_that_referred_me.length === 0) {
                this.contact.contacts_that_referred_me = [];
            } else {
                this.referrer = get('contacts_that_referred_me[0].id', this.contact);
                if (this.referrer) {
                    this.contacts.getName(this.referrer).then((data) => {
                        this.referrerName = data.name;
                    });
                }
            }
        }
    }
    addPartnerAccount() {
        this.contact.donor_accounts.push({id: uuid(), organization: { id: this.users.organizationAccounts[0].organization.id }, account_number: ''});
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
            //wipe out old referrals
            this.contact.contact_referrals_to_me = this.destroyReferrals(this.contact.contact_referrals_to_me);

            //awful, but it just won't serialize all the custom types
            const destroyOld = map(referee => {
                return assign({type: 'contact_referrals'}, referee);
            }, this.contact.contact_referrals_to_me);
            const newId = uuid();
            const newRelationship = {type: "contact_referrals", id: newId};
            const relationshipData = concat(destroyOld, newRelationship);
            const request = {
                "included": [
                    {
                        "type": "contact_referrals",
                        "id": newId,
                        "relationships": {
                            "referred_by": {
                                "data": {
                                    "type": "contacts",
                                    "id": this.referrer
                                }
                            }
                        }
                    }
                ],
                "data": {
                    "type": "contacts",
                    "id": this.contact.id,
                    "attributes": {
                        "overwrite": true
                    },
                    "relationships": {
                        "contact_referrals_to_me": {
                            "data": relationshipData
                        }
                    }
                }
            };
            this.api.put({
                url: `contacts/${this.contact.id}`,
                data: request,
                doSerialization: false
            }).then(() => {
                this.contact.contacts_that_referred_me = [{id: this.referrer}];
                this.alerts.addAlert(this.gettextCatalog.getString('Changes saved successfully.'));
            }).catch(() => {
                this.alerts.addAlert(this.gettextCatalog.getString('Unable to save changes.'), 'danger');
            });
        } else if (!this.referrer && get(this.contact, 'contacts_that_referred_me[0].id')) {
            this.contact.contact_referrals_to_me = this.destroyReferrals(this.contact.contact_referrals_to_me);
            this.onSave().then(() => {
                this.contact.contacts_that_referred_me = [];
            });
        } else {
            this.onSave();
        }
    }
    destroyReferrals(referrals) {
        return map(referee => {
            return { id: referee.id, _destroy: 1 };
        }, referrals);
    }
}
const Details = {
    controller: ContactDetailsController,
    template: require('./details.html'),
    bindings: {
        donorAccounts: '<', //for change detection
        contact: '=',
        onSave: '&'
    }
};

export default angular.module('mpdx.contacts.show.details.component', [])
    .component('contactDetails', Details).name;
