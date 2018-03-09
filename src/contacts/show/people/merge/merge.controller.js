import { map, reject } from 'lodash/fp';

class MergePeopleModalController {
    constructor(
        $rootScope, $scope, gettextCatalog,
        people,
        selectedPeople
    ) {
        this.$rootScope = $rootScope;
        this.$scope = $scope;
        this.gettextCatalog = gettextCatalog;
        this.selectedPeople = selectedPeople;
        this.people = people;

        this.selectedPerson = selectedPeople[0].id;
        this.currentlyMerging = false;
    }
    save() {
        const selectedPeople = reject({ id: this.selectedPerson }, this.selectedPeople);
        let loserIds = [];
        const selectedPeopleToMerge = map((person) => {
            loserIds.push(person.id);
            return { winner_id: this.selectedPerson, loser_id: person.id };
        }, selectedPeople);
        const errorMessage = this.gettextCatalog.getString('There was an error while trying to merge the people');

        return this.people.bulkMerge(selectedPeopleToMerge, errorMessage).then(() => {
            this.$rootScope.$emit('peopleMerged', this.selectedPerson, loserIds);
        }).then(() => {
            this.$scope.$hide();
        }).catch((err) => {
            this.$scope.$hide();
            return err;
        });
    }
}

import people from '../people.service';

export default angular.module('mpdx.contacts.show.people.merge.controller', [
    people
]).controller('mergePeopleModalController', MergePeopleModalController).name;
