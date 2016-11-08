class SelectionStore {
    constructor(
        $localForage, $log, state
    ) {
        this.$localForage = $localForage;
        this.$log = $log;
        this.state = state;
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
        return 'selectedContacts-userId:' + this.state.current_user_id + '-accountListId:' + this.state.current_account_list_id;
    }

}

export default angular.module('mpdx.common.selectionStore.service', [])
    .service('selectionStore', SelectionStore).name;