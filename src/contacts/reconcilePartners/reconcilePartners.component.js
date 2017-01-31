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

        var promises = [];

        var yes = true;
        _.each(this.contactReconciler.duplicateContacts, (duplicateContact) => {
            if (yes) {
                if (duplicateContact.mergeChoice !== -1) {
                    promises.push(this.contactReconciler.confirmDuplicateContact(duplicateContact));
                }
            }
            yes = true;
        });

        this.$q.all(promises).then(() => {
            if (confirmAndContine) {
                this.blockUI.stop();
                this.contactReconciler.fetchDuplicateContacts(true);
            } else {
                this.blockUI.stop();
                this.$state.go('home');
            }
        });
    }
}
const ReconcilePartners = {
    controller: ContactsReconcilePartnersController,
    template: require('./reconcilePartners.html'),
    bindings: {}
};

export default angular.module('mpdx.contacts.reconcilePartners.component', [])
    .component('contactsReconcilePartners', ReconcilePartners).name;
