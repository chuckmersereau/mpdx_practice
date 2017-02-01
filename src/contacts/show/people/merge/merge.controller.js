class MergePeopleModalController {
    contact;
    contactPerson;

    constructor(
        $scope, contactPerson, contact, people
    ) {
        this.$scope = $scope;
        this.contact = contact;
        this.people = people;
        this.contactPerson = contactPerson;

        this.selectedPerson = people[0].id;
        this.currentlyMerging = false;
    }
    save() {
        const peopleToMerge = _.map(this.people, (person) => {
            return {winner_id: this.selectedPerson.id, loser_id: person.id};
        });

        return this.contactPerson.merge(this.contact, peopleToMerge).then(() => {
            this.$scope.$hide();
        }).catch(() => {
            alert('There was an error while trying to merge the people');
        });
    }
}
export default angular.module('mpdx.contacts.show.people.merge.controller', [])
    .controller('mergePeopleModalController', MergePeopleModalController).name;
