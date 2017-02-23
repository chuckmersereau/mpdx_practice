class WebsiteController {
    constructor() {
        this.deleted = false;
    }
    remove() {
        this.deleted = true;
        this.onRemove();
    }
}

const Website = {
    controller: WebsiteController,
    template: require('./website.html'),
    bindings: {
        website: '=',
        onRemove: '&'
    }
};

export default angular.module('mpdx.contacts.show.personModal.website.component', [])
    .component('peopleWebsite', Website).name;
