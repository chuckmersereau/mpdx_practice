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

        const contactsToMerge = _.filter(this.contactReconciler.duplicateContacts, duplicateContact => (duplicateContact.mergeChoice === 0 || duplicateContact.mergeChoice === 1));
        const contactsToIgnore = _.filter(this.contactReconciler.duplicateContacts, duplicateContact => duplicateContact.mergeChoice === 2);

        if (contactsToMerge.length > 0) {
            let winnersAndLosers = [];

            _.each(contactsToMerge, (duplicateContact) => {
                if (duplicateContact.mergeChoice === 0) {
                    winnersAndLosers.push({winner_id: duplicateContact.contacts[0].id, loser_id: duplicateContact.contacts[1].id});
                } else {
                    winnersAndLosers.push({winner_id: duplicateContact.contacts[1].id, loser_id: duplicateContact.contacts[0].id});
                }
            });

            promises.push(this.contactReconciler.mergeContacts(winnersAndLosers));
        }

        _.each(contactsToIgnore, (duplicateContact) => {
            promises.push(this.contactReconciler.ignoreDuplicateContacts(duplicateContact));
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
