import defaultTo from 'lodash/fp/defaultTo';
import isEmpty from 'lodash/fp/isEmpty';
import isNil from 'lodash/fp/isNil';

class SearchController {
    searchText;
    selected;
    selectedName;
    constructor(
        $q, $scope,
        contacts,
        selectedContact, returnFn
    ) {
        this.$q = $q;
        this.$scope = $scope;
        this.contacts = contacts;
        this.returnFn = returnFn;

        this.contactList = [];
        this.searchText = defaultTo('', selectedContact);

        this.search();
    }
    search() {
        if (isEmpty(this.searchText) || isNil(this.searchText)) {
            this.contactList = [];
            return;
        }
        this.contacts.search(this.searchText).then((data) => {
            this.contactList = data;
        });
    }
    save() {
        this.$scope.$hide();
        this.returnFn({id: this.selected, name: this.selectedName});
        return this.$q.resolve();
    }
}

export default angular.module('mpdx.contacts.show.details.contactSearch.controller', [])
    .controller('contactSelectController', SearchController).name;