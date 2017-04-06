class ListController {
    constructor(
        $state, $stateParams,
        contacts
    ) {
        this.$state = $state;
        this.$stateParams = $stateParams;
        this.contacts = contacts;
    }
    $onInit() {
        this.contacts.getFilteredList(true);
        this.selected = this.$stateParams.contactId;
    }
    switchContact(id) {
        this.selected = id;
        this.$state.go('contacts.show', {contactId: id}, {notify: false});
    }
}

const List = {
    template: require('./list.html'),
    controller: ListController
};

export default angular.module('mpdx.contacts.sidebar.list.component', [])
    .component('contactsSidebarList', List).name;