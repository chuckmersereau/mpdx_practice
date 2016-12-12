class ContactsController {
    contactFilter;
    constructor(
        $stateParams, contactFilter
    ) {
        this.$stateParams = $stateParams;
        this.contactFilter = contactFilter;
    }
    $onInit() {
        if (this.$stateParams.filter) {
            _.assign(this.contactFilter.params, this.contactFilter.params, this.$stateParams.filter);
        }
    }
}

const Contacts = {
    controller: ContactsController,
    controllerAs: 'vm',
    template: require('./contacts.html'),
    bindings: {}
};

export default angular.module('mpdx.contacts.component', [])
    .component('contacts', Contacts).name;