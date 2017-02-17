class MergePeopleModalController {
    alerts;
    contact;
    people;

    constructor(
        $scope, people,
        alerts, contact, selectedPeople
    ) {
        this.alerts = alerts;
        this.$scope = $scope;
        this.contact = contact;
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
                                type: "contacts",
                                id: person.id
                            }
                        },
                        winner: {
                            data: {
                                type: "contacts",
                                id: this.selectedPerson
                            }
                        }
                    }
                }
            };
        });

        return this.people.merge(this.contact, selectedPeopleToMerge).catch(() => {
            this.alerts.addAlert('There was an error while trying to merge the people');
        }).finally(() => {
            this.$scope.$hide();
        });
    }
}
export default angular.module('mpdx.contacts.show.people.merge.controller', [])
    .controller('mergePeopleModalController', MergePeopleModalController).name;
