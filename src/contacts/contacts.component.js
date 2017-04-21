class ContactsController {
    contactFilter;
    help;

    constructor(
        $rootScope, $state, $stateParams, gettextCatalog,
        contactFilter, help
    ) {
        this.$rootScope = $rootScope;
        this.$state = $state;
        this.$stateParams = $stateParams;
        this.gettextCatalog = gettextCatalog;

        this.contactFilter = contactFilter;

        help.suggest([
            this.gettextCatalog.getString('58d3d70ddd8c8e7f5974d3ca'),
            this.gettextCatalog.getString('5845aa229033600698176a54'),
            this.gettextCatalog.getString('5841bd789033600698175e62'),
            this.gettextCatalog.getString('584715b890336006981774d2'),
            this.gettextCatalog.getString('5845aab3c6979106d373a576'),
            this.gettextCatalog.getString('58471fd6903360069817752e'),
            this.gettextCatalog.getString('5845ac509033600698176a62'),
            this.gettextCatalog.getString('5845abb0c6979106d373a57b'),
            this.gettextCatalog.getString('5845984f90336006981769a1'),
            this.gettextCatalog.getString('584597e6903360069817699d'),
            this.gettextCatalog.getString('5845af809033600698176a8c'),
            this.gettextCatalog.getString('5845acfcc6979106d373a580'),
            this.gettextCatalog.getString('5845ad8c9033600698176a6e')
        ]);
    }
    $onInit() {
        this.selected = this.$stateParams.contactId;
    }
}

const Contacts = {
    controller: ContactsController,
    template: require('./contacts.html')
};

export default angular.module('mpdx.contacts.component', [])
    .component('contacts', Contacts).name;
