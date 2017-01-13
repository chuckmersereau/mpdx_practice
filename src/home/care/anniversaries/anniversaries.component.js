class anniversariesController {
    anniversaries;
    contacts;

    constructor(
        contacts
    ) {
        this.contacts = contacts;
    }

}

const anniversariesComponent = {
    controller: anniversariesController,
    template: require('./anniversaries.html')
};


export default angular.module('mpdx.common.anniversaries', [])
    .component('anniversaries', anniversariesComponent).name;

