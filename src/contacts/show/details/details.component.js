import keys from 'lodash/fp/keys';
import map from 'lodash/fp/map';
import uuid from 'uuid/v1';

class ContactDetailsController {
    alerts
    contact;
    contacts;
    contactsTags;
    serverConstants;
    users;

    constructor(
        $window, gettextCatalog,
        alerts, contactsTags, contacts, serverConstants, users
    ) {
        this.alerts = alerts;
        this.contacts = contacts;
        this.contactsTags = contactsTags;
        this.gettextCatalog = gettextCatalog;
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
        if (this.referrer && this.contact.contacts_that_referred_me[0]) {
            this.contact.contacts_that_referred_me[0].id = this.referrer;
        } else if (this.referrer) {
            this.contact.contacts_that_referred_me.push({id: this.referrer});
        } else {
            this.contact.contacts_that_referred_me = [];
        }

        this.onSave().then((data) => {
            this.contact.updated_in_db_at = data.updated_in_db_at;
        }).catch(() => {
            this.alerts.addAlert(this.gettextCatalog.getString('There was an error updating this contact, please refresh your browser.'), 'danger');
        });
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
