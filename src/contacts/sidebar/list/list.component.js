class ListController {
    constructor(
        $rootScope, $state, $stateParams,
        contacts
    ) {
        this.$state = $state;
        this.$stateParams = $stateParams;
        this.contacts = contacts;

        $rootScope.$on('contactCreated', () => {
            contacts.getFilteredList(true);
        });

        $rootScope.$on('accountListUpdated', () => {
            contacts.getFilteredList(true);
        });

        $rootScope.$on('contactsFilterChange', () => {
            contacts.getFilteredList(true);
        });
    }
    $onInit() {
        this.selected = this.$stateParams.contactId;
        this.contacts.getFilteredList(true); //lazy load
    }
    switchContact(id) {
        this.selected = id;
        this.$state.go('contacts.show', {contactId: id});
    }
}

const List = {
    template: require('./list.html'),
    controller: ListController
};

export default angular.module('mpdx.contacts.sidebar.list.component', [])
    .component('contactsSidebarList', List).name;