class BirthdaysController {
    contacts;

    constructor(contacts) {
        this.contacts = contacts;
        this.limit = 5;
    }
}

const Birthdays = {
    controller: BirthdaysController,
    template: require('./birthdays.html')
};

export default angular.module('mpdx.home.care.birthdays', [])
    .component('birthdays', Birthdays).name;
