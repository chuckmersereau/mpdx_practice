class anniversariesController {
    anniversaries;
    contactsService;

    constructor(
        contactsService
    ) {
        this.contactsService = contactsService;

        this.anniversaries = [];
    }
    $onInit() {
        this.getAnniversaries();
    }
    $onChanges() {
        this.getAnniversaries();
    }
    getAnniversaries() {
        console.error('common/anniversaries: analytics TBD');
        this.contactsService.getAnalytics().then(() => {
            //TODO: Connect this.anniversaries to V2 endpoint
        });
    }
}

const anniversariesComponent = {
    controller: anniversariesController,
    template: require('./anniversaries.html')
};


export default angular.module('mpdx.common.anniversaries', [])
    .component('anniversaries', anniversariesComponent).name;

