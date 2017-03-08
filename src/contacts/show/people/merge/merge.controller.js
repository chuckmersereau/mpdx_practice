import map from 'lodash/fp/map';
import reject from 'lodash/fp/reject';

class MergePeopleModalController {
    alerts;
    contact;
    people;

    constructor(
        $scope,
        people, alerts,
        selectedPeople
    ) {
        this.alerts = alerts;
        this.$scope = $scope;
        this.selectedPeople = selectedPeople;
        this.people = people;

        this.selectedPerson = selectedPeople[0].id;
        this.currentlyMerging = false;
    }
    save() {
        const selectedPeople = reject({id: this.selectedPerson}, this.selectedPeople);
        const selectedPeopleToMerge = map((person) => {
            return { winner_id: this.selectedPerson, loser_id: person.id };
        }, selectedPeople);

        return this.people.bulkMerge(selectedPeopleToMerge).catch(() => {
            this.alerts.addAlert('There was an error while trying to merge the people', 'danger');
        }).finally(() => {
            this.$scope.$hide();
        });
    }
}
export default angular.module('mpdx.contacts.show.people.merge.controller', [])
    .controller('mergePeopleModalController', MergePeopleModalController).name;
