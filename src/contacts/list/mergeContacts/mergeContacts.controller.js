class MergeContactsController {
    api;
    constructor(
        $scope, api, contactIds, contactNames
    ) {
        this.$scope = $scope;
        this.api = api;
        this.contactNames = contactNames;
        this.contactIds = contactIds;
    }
    submit() {
        this.api.post('contacts/merge', { merge_contact_ids: this.contactIds.join() }).then(() => {
            this.$scope.$hide();
            location.reload();
        });
    }
}
export default angular.module('mpdx.contacts.list.mergeContacts.controller', [])
    .controller('mergeContactsController', MergeContactsController).name;
