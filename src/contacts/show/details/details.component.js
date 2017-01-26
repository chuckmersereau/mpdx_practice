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
        // Maybe calculate this way?
        // this.last_donation = null;
        // this.lifetime_donations = 0;
        // if (this.donorAccounts) {
        //     _.each(this.donorAccounts, account => {
        //         const date = moment(account.last_donation_date, "YYYY-MM-DD");
        //         if (!this.last_donation && this.last_donation < date) {
        //             this.last_donation = date;
        //         }
        //         this.lifetime_donations += parseFloat(account.total_donations);
        //     });
        // }
        // if (this.last_donation) {
        //     this.last_donation = this.last_donation.format('l');
        // }

        //get contact reference data
        if (this.contact.referred_by) {
            this.contacts.find(this.contact.referred_by);
        }
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
        this.contact.no_appeals = this.appeals === 'true';
        this.contacts.save(this.contact);
    }
}
const Details = {
    controller: ContactDetailsController,
    template: require('./details.html'),
    bindings: {
        donorAccounts: '<', //for change detection
        contact: '=',
        constants: '='
    }
};

export default angular.module('mpdx.contacts.show.details.component', [])
    .component('contactDetails', Details).name;
