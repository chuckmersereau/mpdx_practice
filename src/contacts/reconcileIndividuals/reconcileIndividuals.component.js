import each from 'lodash/fp/each';
import filter from 'lodash/fp/filter';
import map from 'lodash/fp/map';

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

        const peopleToMerge = filter(duplicatePerson => (duplicatePerson.mergeChoice === 0 || duplicatePerson.mergeChoice === 1), this.contactReconciler.duplicatePeople);
        const peopleToIgnore = filter({mergeChoice: 2}, this.contactReconciler.duplicatePeople);

        if (peopleToMerge.length > 0) {
            const winnersAndLosers = map(duplicatePerson => {
                if (duplicatePerson.mergeChoice === 0) {
                    return {winner_id: duplicatePerson.people[0].id, loser_id: duplicatePerson.people[1].id};
                }
                return {winner_id: duplicatePerson.people[1].id, loser_id: duplicatePerson.people[0].id};
            }, peopleToMerge);

            promises.push(this.contactReconciler.mergePeople(winnersAndLosers));
        }

        each(duplicatePerson => {
            promises.push(this.contactReconciler.ignoreDuplicatePeople(duplicatePerson));
        }, peopleToIgnore);

        this.$q.all(promises).then(() => {
            this.blockUI.stop();
            this.contactReconciler.fetchDuplicatePeople(true);

            if (!confirmAndContine) {
                this.$state.go('contacts');
            }
        });
    }

    confirmButtonText(confirmAndContinue) {
        let count = filter(duplicatePerson => (duplicatePerson.mergeChoice !== -1), this.contactReconciler.duplicatePeople).length;
        if (count === 0) {
            return `No Selection`;
        } else {
            return `Confirm ${count > 1 ? 'These' : 'This'} ${count} ${confirmAndContinue ? 'And Continue' : 'And Quit Reconciling'}`;
        }
    }

    confirmButtonDisabled() {
        let count = filter(duplicatePerson => (duplicatePerson.mergeChoice !== -1), this.contactReconciler.duplicatePeople).length;
        return count === 0;
    }
}
const ReconcileIndividuals = {
    controller: ContactsReconcileIndividualsController,
    template: require('./reconcileIndividuals.html')
};

export default angular.module('mpdx.contacts.reconcileIndividuals.component', [])
    .component('contactsReconcileIndividuals', ReconcileIndividuals).name;
