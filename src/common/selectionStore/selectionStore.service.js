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
