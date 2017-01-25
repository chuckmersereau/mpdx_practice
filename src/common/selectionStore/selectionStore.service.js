class SelectionStore {
    constructor(
        $localForage, $log, users, api
    ) {
        this.$localForage = $localForage;
        this.$log = $log;
        this.users = users;
        this.api = api;
    }
    // This returns a promise from localForage for the retrieved contacts.
    loadSelectedContacts() {
        return this.$localForage.getItem(this.selectedContactsStorageKey());
    }

    // Since handling the promise case for a successful save is trivial and
    // for a failure case we just log it, then just handle the promise here
    // to avoid duplication in the callers of it.
    saveSelectedContacts(selectedContacts) {
        this.$localForage.setItem(this.selectedContactsStorageKey(), selectedContacts).catch(() => {
            this.$log.error('Failed to save selected contacts');
        });
    }
    selectedContactsStorageKey() {
        return 'selectedContacts-userId:' + this.users.current.id + '-accountListId:' + this.api.account_list_id;
    }

}

export default angular.module('mpdx.common.selectionStore.service', [])
    .service('selectionStore', SelectionStore).name;
