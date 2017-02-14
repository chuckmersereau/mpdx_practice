class ContactsReconcileIndividualsController {
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

        this.contactReconciler.fetchDuplicatePeople();
    }

    useThisOne(duplicatePerson, mergeChoice = -1) {
        if (duplicatePerson.mergeChoice === mergeChoice) {
            duplicatePerson.mergeChoice = -1;
        } else {
            duplicatePerson.mergeChoice = mergeChoice;
        }
    }

    confirm(confirmAndContine = true) {
        this.blockUI.start();

        let promises = [];

        _.each(this.contactReconciler.duplicatePeople, (duplicatePerson) => {
            if (duplicatePerson.mergeChoice !== -1) {
                promises.push(this.contactReconciler.confirmDuplicatePerson(duplicatePerson));
            }
        });

        this.$q.all(promises).then(() => {
            this.blockUI.stop();
            this.contactReconciler.fetchDuplicatePeople(true);

            if (!confirmAndContine) {
                this.$state.go('home');
            }
        });
    }

    confirmButtonText(confirmAndContinue) {
        let count = _.filter(this.contactReconciler.duplicatePeople, duplicatePerson => (duplicatePerson.mergeChoice !== -1)).length;
        if (count === 0) {
            return `No Selection`;
        } else {
            return `Confirm ${count > 1 ? 'These' : 'This'} ${count} ${confirmAndContinue ? 'And Continue' : 'And Quit Reconciling'}`;
        }
    }

    confirmButtonDisabled() {
        let count = _.filter(this.contactReconciler.duplicatePeople, duplicatePerson => (duplicatePerson.mergeChoice !== -1)).length;
        return count === 0;
    }
}
const ReconcileIndividuals = {
    controller: ContactsReconcileIndividualsController,
    template: require('./reconcileIndividuals.html'),
    bindings: {}
};

export default angular.module('mpdx.contacts.reconcileIndividuals.component', [])
    .component('contactsReconcileIndividuals', ReconcileIndividuals).name;
