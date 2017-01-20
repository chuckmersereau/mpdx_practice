class ContactDetailsController {
    appeals;
    contact;
    contacts;
    contactsTags;

    constructor(
        $window,
        contactsTags, contacts
    ) {
        this.contacts = contacts;
        this.contactsTags = contactsTags;

        this.appeals = 'false';

        this.languages = _.map(_.keys($window.languageMappingList), (key) => {
            const language = window.languageMappingList[key];
            return {alias: key, value: `${language.englishName} (${language.nativeName} - ${key}`};
        });
    }
    $onChanges() {
        if (this.contact.no_appeals === true) {
            this.appeals = 'true';
        } else {
            this.appeals = 'false';
        }
    }
    addPartnerAccount() {
        this.contact.donor_accounts.push({ account_number: '', organization_id: this.organization_id, _destroy: 0 });
    }
    save() {
        this.contact.no_appeals = this.appeals;
        this.contacts.save(this.contact);
    }
}
const Details = {
    controller: ContactDetailsController,
    template: require('./details.html'),
    bindings: {
        contact: '=',
        constants: '='
    }
};

export default angular.module('mpdx.contacts.show.details.component', [])
    .component('contactDetails', Details).name;
