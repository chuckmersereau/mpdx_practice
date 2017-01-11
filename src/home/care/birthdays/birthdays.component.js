class birthdaysController {
    birthdays;
    contacts;

    constructor(contacts) {
        this.contacts = contacts;
    }
}

const birthdaysComponent = {
    controller: birthdaysController,
    template: require('./birthdays.html')
};

export default angular.module('mpdx.common.birthdays', [])
    .component('birthdays', birthdaysComponent).name;