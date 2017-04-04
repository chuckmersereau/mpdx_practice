import filter from 'lodash/fp/filter';

class MergeContactsController {
    api;
    mergeContacts;

    constructor(
        $log, $q, $state, blockUI,
        api, mergeContacts
    ) {
        this.$log = $log;
        this.$q = $q;
        this.$state = $state;
        this.blockUI = blockUI.instances.get('merge-contacts');
        this.api = api;
        this.mergeContacts = mergeContacts;
    }

    useThisOne(duplicate, mergeChoice = -1) {
        if (duplicate.mergeChoice === mergeChoice) {
            duplicate.mergeChoice = -1;
        } else {
            duplicate.mergeChoice = mergeChoice;
        }
    }

    confirm(confirmAndLeave = true) {
        this.blockUI.start();
        this.mergeContacts.confirm().then(() => {
            this.blockUI.reset();
            if (confirmAndLeave) {
                this.$state.go('tools');
            }
        });
    }

    confirmButtonDisabled() {
        return filter(duplicate => (duplicate.mergeChoice !== -1), this.mergeContacts.duplicates).length === 0;
    }
}
const MergeContacts = {
    controller: MergeContactsController,
    template: require('./mergeContacts.html')
};

export default angular.module('mpdx.tools.mergeContacts.component', [])
    .component('mergeContacts', MergeContacts).name;
