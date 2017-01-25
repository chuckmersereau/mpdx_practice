class anniversariesController {
    contacts;

    constructor(
        contacts
    ) {
        this.contacts = contacts;
        this.limit = 5;
    }

}

const anniversariesComponent = {
    controller: anniversariesController,
    template: require('./anniversaries.html')
};


export default angular.module('mpdx.common.anniversaries', [])
    .component('anniversaries', anniversariesComponent).name;

