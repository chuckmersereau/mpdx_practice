import each from 'lodash/fp/each';
import filter from 'lodash/fp/filter';
import map from 'lodash/fp/map';

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

        const contactsToMerge = filter(duplicateContact => (duplicateContact.mergeChoice === 0 || duplicateContact.mergeChoice === 1), this.contactReconciler.duplicateContacts);
        const contactsToIgnore = filter(duplicateContact => duplicateContact.mergeChoice === 2, this.contactReconciler.duplicateContacts);

        if (contactsToMerge.length > 0) {
            const winnersAndLosers = map(duplicateContact => {
                if (duplicateContact.mergeChoice === 0) {
                    return { winner_id: duplicateContact.contacts[0].id, loser_id: duplicateContact.contacts[1].id };
                }
                return { winner_id: duplicateContact.contacts[1].id, loser_id: duplicateContact.contacts[0].id };
            }, contactsToMerge);
            promises.push(this.contactReconciler.mergeContacts(winnersAndLosers));
        }

        each(duplicateContact => {
            promises.push(this.contactReconciler.ignoreDuplicateContacts(duplicateContact));
        }, contactsToIgnore);

        this.$q.all(promises).then(() => {
            this.blockUI.stop();
            this.contactReconciler.fetchDuplicateContacts(true);

            if (!confirmAndContine) {
                this.$state.go('contacts');
            }
        });
    }

    confirmButtonText(confirmAndContinue) {
        let count = filter(duplicateContact => (duplicateContact.mergeChoice !== -1), this.contactReconciler.duplicateContacts).length;
        if (count === 0) {
            return `No Selection`;
        } else {
            return `Confirm ${count > 1 ? 'These' : 'This'} ${count} ${confirmAndContinue ? 'And Continue' : 'And Quit Reconciling'}`;
        }
    }

    confirmButtonDisabled() {
        let count = filter(duplicateContact => (duplicateContact.mergeChoice !== -1), this.contactReconciler.duplicateContacts).length;
        return count === 0;
    }
}
const ReconcilePartners = {
    controller: ContactsReconcilePartnersController,
    template: require('./reconcilePartners.html')
};

export default angular.module('mpdx.contacts.reconcilePartners.component', [])
    .component('contactsReconcilePartners', ReconcilePartners).name;
