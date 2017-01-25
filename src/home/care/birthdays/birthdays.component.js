class birthdaysController {
    contacts;

    constructor(contacts) {
        this.contacts = contacts;
        this.limit = 5;
    }
}

const birthdaysComponent = {
    controller: birthdaysController,
    template: require('./birthdays.html')
};

export default angular.module('mpdx.common.birthdays', [])
    .component('birthdays', birthdaysComponent).name;