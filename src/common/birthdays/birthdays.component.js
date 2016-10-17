class birthdaysController {
    constructor(currentAccountList) {
        this.currentAccountList = currentAccountList;

        this.birthdays = [];
    }
    $onInit() {
        if (!this.currentAccountList.people_with_birthdays) {
            this.currentAccountList.getPeopleWithBirthdays();
        }
    }
    $onChanges(e) {
        if (e.currentAccountList) {
            this.birthdays = this.currentAccountList.people_with_birthdays;
        }
    }

}

const birthdaysComponent = {
    controller: birthdaysController,
    template: require('./birthdays.html')
};

export default angular.module('mpdx.common.birthdays', [])
    .component('birthdays', birthdaysComponent).name;