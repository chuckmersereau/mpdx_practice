class ContactDetailsController {
    appeals;
    contact;
    contacts;
    contactsTags;
    serverConstants;

    constructor(
        $window,
        contactsTags, contacts, serverConstants
    ) {
        this.contacts = contacts;
        this.contactsTags = contactsTags;

        this.appeals = 'false';

        this.languages = _.map(_.keys(serverConstants.data.locales), (locale) => {
            const language = $window.languageMappingList[locale];
            if (language) {
                return {alias: locale, value: `${language.englishName} (${language.nativeName} - ${locale})`};
            } else {
                return {alias: locale, value: serverConstants.data.locales[locale]};
            }
        });
    }
    $onChanges() {
        //get contact reference data
        // if (this.contact.referred_by) {
        //     this.contacts.find(this.contact.referred_by);
        // }
    }
    addPartnerAccount() {
        this.contact.donor_accounts.push({ account_number: '', organization_id: this.organization_id, _destroy: 0 });
    }
    save() {
        this.contacts.save(this.contact).then((data) => {
            this.contact.updated_in_db_at = data.updated_in_db_at;
        });
    }
}
const Details = {
    controller: ContactDetailsController,
    template: require('./details.html'),
    bindings: {
        donorAccounts: '<', //for change detection
        contact: '='
    }
};

export default angular.module('mpdx.contacts.show.details.component', [])
    .component('contactDetails', Details).name;
