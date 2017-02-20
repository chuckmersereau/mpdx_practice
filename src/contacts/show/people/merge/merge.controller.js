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
        const selectedPeople = _.reject(this.selectedPeople, {id: this.selectedPerson});
        const selectedPeopleToMerge = _.map(selectedPeople, (person) => {
            return {
                data: {
                    type: "merges",
                    attributes: {},
                    relationships: {
                        loser: {
                            data: {
                                type: "people",
                                id: person.id
                            }
                        },
                        winner: {
                            data: {
                                type: "people",
                                id: this.selectedPerson
                            }
                        }
                    }
                }
            };
        });

        return this.people.merge(selectedPeopleToMerge).catch(() => {
            this.alerts.addAlert('There was an error while trying to merge the people', 'danger');
        }).finally(() => {
            this.$scope.$hide();
        });
    }
}
export default angular.module('mpdx.contacts.show.people.merge.controller', [])
    .controller('mergePeopleModalController', MergePeopleModalController).name;
