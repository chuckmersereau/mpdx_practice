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

        var promises = [];

        _.each(this.contactReconciler.duplicatePeople, (duplicatePerson) => {
            if (duplicatePerson.mergeChoice !== -1) {
                promises.push(this.contactReconciler.confirmDuplicatePerson(duplicatePerson));
            }
        });

        this.$q.all(promises).then(() => {
            if (confirmAndContine) {
                this.blockUI.stop();
                this.contactReconciler.fetchDuplicatePeople(true);
            } else {
                this.blockUI.stop();
                this.$state.go('home');
            }
        });
    }
}
const ReconcileIndividuals = {
    controller: ContactsReconcileIndividualsController,
    template: require('./reconcileIndividuals.html'),
    bindings: {}
};

export default angular.module('mpdx.contacts.reconcileIndividuals.component', [])
    .component('contactsReconcileIndividuals', ReconcileIndividuals).name;
