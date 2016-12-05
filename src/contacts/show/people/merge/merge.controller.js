class MergePeopleModalController {
    contact;

    constructor(
        $scope, personService, contact, people
    ) {
        this.$scope = $scope;
        this.contact = contact;
        this.people = people;
        this.personService = personService;

        this.selectedPerson = people[0].id;
        this.currentlyMerging = false;
    }
    mergePeople() {
        this.currentlyMerging = true;
        var peopleToMerge = _.map(this.people, 'id');
        this.personService.mergePeople(this.contact.id, this.selectedPerson, peopleToMerge).then(() => {
            this.$scope.$hide();
        }).catch(() => {
            alert('There was an error while trying to merge the people');
        }).finally(() => {
            this.currentlyMerging = false;
        });
    }
}
export default angular.module('mpdx.contacts.show.people.merge.controller', [])
    .controller('mergePeopleModalController', MergePeopleModalController).name;
