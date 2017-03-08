class AnniversariesController {
    contacts;

    constructor(
        contacts
    ) {
        this.contacts = contacts;
        this.limit = 5;
    }

}

const Anniversaries = {
    controller: AnniversariesController,
    template: require('./anniversaries.html')
};


export default angular.module('mpdx.home.care.anniversaries', [])
    .component('anniversaries', Anniversaries).name;
