import { findIndex, isArray } from 'lodash/fp';
import contacts, { ContactsService } from '../../contacts/contacts.service';

class SelectorController {
    inputTag: Element;
    ngModel: any;
    selectedContacts: any;
    constructor(
        private $element: ng.IRootElementService,
        private $timeout: ng.ITimeoutService,
        private contacts: ContactsService
    ) {}
    $onInit() {
        this.init();
        this.$timeout(() => {
            try {
                this.inputTag = this.$element[0].children[0].children[0].children[0].children[1];
            } catch (e) {
                this.inputTag = null;
            }
        }, 500);
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
        if (this.inputTag) {
            this.inputTag.scrollTop = 0;
        }
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
        ngModel: '='
    }
};

export default angular.module('mpdx.common.contactsSelector.component', [
    contacts
]).component('contactsSelector', Selector).name;