class birthdaysController {
    birthdays;
    contacts;

    constructor(contacts) {
        this.contacts = contacts;

        this.birthdays = [];
    }
    $onInit() {
        this.getBirthdays();
    }
    $onChanges() {
        this.getBirthdays();
    }
    getBirthdays() {
        console.error('common/birthdays: analytics TBD');
        //this.contacts.getAnalytics().then(() => {
            //TODO: Connect this.birthdays to V2 endpoint
        //});
    }

}

const birthdaysComponent = {
    controller: birthdaysController,
    template: require('./birthdays.html')
};

export default angular.module('mpdx.common.birthdays', [])
    .component('birthdays', birthdaysComponent).name;