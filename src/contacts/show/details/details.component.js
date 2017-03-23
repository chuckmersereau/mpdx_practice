import get from 'lodash/fp/get';
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
        if (this.referrer && this.referrer !== get(this.contact, 'contacts_that_referred_me[0].id')) {
            this.contact.contact_referrals_to_me = [{id: uuid(), referred_by: {id: this.referrer}}];
        }

        this.onSave();
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
