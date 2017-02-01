class ContactsController {
    contactFilter;

    constructor($stateParams, contactFilter, help) {
        this.$stateParams = $stateParams;
        this.contactFilter = contactFilter;

        help.suggest([
            '5845aa229033600698176a54',
            '5841bd789033600698175e62',
            '584715b890336006981774d2',
            '5845aab3c6979106d373a576',
            '58471fd6903360069817752e',
            '5845ac509033600698176a62',
            '5845abb0c6979106d373a57b',
            '5845984f90336006981769a1',
            '584597e6903360069817699d',
            '5845af809033600698176a8c',
            '5845acfcc6979106d373a580',
            '5845ad8c9033600698176a6e'
        ]);
    }
    $onInit() {
        if (this.$stateParams.filters) {
            _.assign(this.contactFilter.params, this.contactFilter.params, this.$stateParams.filters);
            this.contactFilter.change();
        }
    }
}

const Contacts = {
    controller: ContactsController,
    template: require('./contacts.html')
};

export default angular.module('mpdx.contacts.component', [])
    .component('contacts', Contacts).name;
