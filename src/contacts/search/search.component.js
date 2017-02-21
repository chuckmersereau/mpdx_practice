class ContactsSearchController {
    contacts;
    contactFilter;

    constructor(
        $state,
        contacts
    ) {
        this.$state = $state;
        this.contacts = contacts;

        this.searchParams = '';
    }
    go(contactId) {
        console.log('jkdskjdfskjhsdkjhdsfhjkdskhjdsf');
        this.searchParams = '';
        this.$state.go('contact', {contactId: contactId}, {reload: true});
    }
}
const Search = {
    controller: ContactsSearchController,
    template: require('./search.html'),
    bindings: {
        dropdown: '<',
        showFilters: '@'
    }
};

export default angular.module('mpdx.common.contacts.search', [])
    .component('contactsSearch', Search).name;
