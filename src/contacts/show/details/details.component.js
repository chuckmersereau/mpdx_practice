class ContactDetailsController {
    contact;
    contactsService;
    tagsService;

    constructor(
        contactsTagsService, contactsService
    ) {
        this.contactsService = contactsService;
        this.tagsService = contactsTagsService;

        this.appeals = 'false';
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
        this.contactsService.save(this.contact);
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
