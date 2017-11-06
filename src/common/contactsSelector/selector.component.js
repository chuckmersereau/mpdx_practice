import findIndex from 'lodash/fp/findIndex';
import isArray from 'lodash/fp/isArray';

class SelectorController {
    constructor(
        $filter,
        contacts
    ) {
        this.$filter = $filter;
        this.contacts = contacts;
    }
    $onInit() {
        this.init();
    }
    init() {
        // make sure ngModel is an array before we try to modify it
        if (!isArray(this.ngModel)) {
            this.ngModel = [];
        }
        // map to tag object if array of names
        this.selectedContacts = angular.copy(this.ngModel);
    }
    // keep reference to this.ngModel, don't use fp below
    addContact($tag) {
        this.ngModel.push($tag);
    }
    removeContact($tag) {
        const index = findIndex({ id: $tag.id }, this.ngModel);
        if (index > -1) {
            this.ngModel.splice(index, 1);
        }
    }
}

const Selector = {
    template: require('./selector.html'),
    controller: SelectorController,
    bindings: {
        ngModel: '=',
        onContactAdded: '&',
        onContactRemoved: '&'
    }
};

import contacts from 'contacts/contacts.service';

export default angular.module('mpdx.common.contactsSelector.component', [
    contacts
]).component('contactsSelector', Selector).name;