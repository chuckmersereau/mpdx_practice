class anniversariesController {
    anniversaries;
    contacts;

    constructor(
        contacts
    ) {
        this.contacts = contacts;

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
        //this.contacts.getAnalytics().then(() => {
            //TODO: Connect this.anniversaries to V2 endpoint
        //});
    }
}

const anniversariesComponent = {
    controller: anniversariesController,
    template: require('./anniversaries.html')
};


export default angular.module('mpdx.common.anniversaries', [])
    .component('anniversaries', anniversariesComponent).name;

