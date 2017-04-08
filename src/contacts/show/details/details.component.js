import get from 'lodash/fp/get';
import keys from 'lodash/fp/keys';
import map from 'lodash/fp/map';
import uuid from 'uuid/v1';

class ContactDetailsController {
    alerts;
    contact;
    contacts;
    contactsTags;
    onSave;
    serverConstants;
    users;

    constructor(
        $window, gettextCatalog,
        alerts, api, contactsTags, contacts, locale, serverConstants, users
    ) {
        this.alerts = alerts;
        this.api = api;
        this.contacts = contacts;
        this.contactsTags = contactsTags;
        this.gettextCatalog = gettextCatalog;
        this.locale = locale;
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
                this.referrer = this.contact.contacts_that_referred_me[0].id || null;
            }
        }
    }
    addPartnerAccount() {
        this.contact.donor_accounts.push({id: uuid(), organization: { id: this.users.organizationAccounts[0].organization.id }, account_number: ''});
    }
    save() {
        if (this.referrer && this.referrer !== get('contacts_that_referred_me[0].id', this.contact)) {
            // this.contact.contact_referrals_to_me = [{id: uuid(), referred_by: {id: this.referrer}}];
            //awful, but it just won't serialize all the custom types
            const newId = uuid();
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
                    "relationships": {
                        "contact_referrals_to_me": {
                            "data": [
                                {
                                    "type": "contact_referrals",
                                    "id": newId
                                }
                            ]
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
        } else if (get(this.contact, 'contacts_that_referred_me[0].id')) {
            this.contact.contact_referrals_to_me = [];
            this.onSave().then(() => {
                this.contact.contacts_that_referred_me = [];
            });
        } else {
            this.onSave();
        }
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
