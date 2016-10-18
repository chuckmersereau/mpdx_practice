class ContactsController {
    constructor($stateParams, filterService) {
        this.$stateParams = $stateParams;
        this.filterService = filterService;
    }
    $onInit() {
        if (this.$stateParams.filter) {
            _.assign(this.filterService.params, this.filterService.params, this.$stateParams.filter);
        }
    }
}

const Contacts = {
    controller: ContactsController,
    controllerAs: 'vm',
    template: require('./contacts.html'),
    bindings: {}
};

import filter from './filter/filter.component';
import list from './list/list.component';

export default angular.module('mpdx.contacts', [
    filter,
    list
]).component('contacts', Contacts).name;