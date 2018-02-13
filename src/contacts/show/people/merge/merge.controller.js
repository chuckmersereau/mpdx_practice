import { map, reject } from 'lodash/fp';

class MergePeopleModalController {
    constructor(
        $rootScope, $scope, gettextCatalog,
        people, alerts,
        selectedPeople
    ) {
        this.alerts = alerts;
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

        return this.people.bulkMerge(selectedPeopleToMerge).then(() => {
            this.$rootScope.$emit('peopleMerged', this.selectedPerson, loserIds);
        }).then(() => {
            this.$scope.$hide();
        }).catch((err) => {
            const message = this.gettextCatalog.getString('There was an error while trying to merge the people');
            this.alerts.addAlert(message, 'danger');
            this.$scope.$hide();
            return err;
        });
    }
}

import alerts from 'common/alerts/alerts.service';
import people from '../people.service';

export default angular.module('mpdx.contacts.show.people.merge.controller', [
    alerts, people
]).controller('mergePeopleModalController', MergePeopleModalController).name;
