class birthdaysController {
    birthdays;
    contactsService;

    constructor(contactsService) {
        this.contactsService = contactsService;

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
        this.contactsService.getAnalytics().then(() => {
            //TODO: Connect this.birthdays to V2 endpoint
        });
    }

}

const birthdaysComponent = {
    controller: birthdaysController,
    template: require('./birthdays.html')
};

export default angular.module('mpdx.common.birthdays', [])
    .component('birthdays', birthdaysComponent).name;