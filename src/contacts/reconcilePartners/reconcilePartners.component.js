class ContactsReconcilePartnersController {
    api;
    contactReconciler;

    constructor(
        $log, $q, $state, blockUI,
        api, contactReconciler
    ) {
        this.$log = $log;
        this.$q = $q;
        this.$state = $state;
        this.blockUI = blockUI.instances.get('find-duplicates');
        this.api = api;
        this.contactReconciler = contactReconciler;

        this.contactReconciler.fetchDuplicateContacts();
    }

    useThisOne(duplicateContact, mergeChoice = -1) {
        if (duplicateContact.mergeChoice === mergeChoice) {
            duplicateContact.mergeChoice = -1;
        } else {
            duplicateContact.mergeChoice = mergeChoice;
        }
    }

    confirm(confirmAndContine = true) {
        this.blockUI.start();

        let promises = [];

        _.each(this.contactReconciler.duplicateContacts, (duplicateContact) => {
            if (duplicateContact.mergeChoice !== -1) {
                promises.push(this.contactReconciler.confirmDuplicateContact(duplicateContact));
            }
        });

        this.$q.all(promises).then(() => {
            this.blockUI.stop();
            this.contactReconciler.fetchDuplicateContacts(true);

            if (!confirmAndContine) {
                this.$state.go('home');
            }
        });
    }

    confirmButtonText(confirmAndContinue) {
        let count = _.filter(this.contactReconciler.duplicateContacts, duplicateContact => (duplicateContact.mergeChoice !== -1)).length;
        if (count === 0) {
            return `No Selection`;
        } else {
            return `Confirm ${count > 1 ? 'These' : 'This'} ${count} ${confirmAndContinue ? 'And Continue' : 'And Quit Reconciling'}`;
        }
    }

    confirmButtonDisabled() {
        let count = _.filter(this.contactReconciler.duplicateContacts, duplicateContact => (duplicateContact.mergeChoice !== -1)).length;
        return count === 0;
    }
}
const ReconcilePartners = {
    controller: ContactsReconcilePartnersController,
    template: require('./reconcilePartners.html'),
    bindings: {}
};

export default angular.module('mpdx.contacts.reconcilePartners.component', [])
    .component('contactsReconcilePartners', ReconcilePartners).name;
