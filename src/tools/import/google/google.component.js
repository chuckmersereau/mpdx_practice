class GoogleImportController {
    constructor(
        contactsTags
    ) {
        this.contactsTags = contactsTags;
    }
    save() {

    }
}

const GoogleImport = {
    controller: GoogleImportController,
    template: require('./google.html'),
    bindings: {
        preferences: '<',
        setup: '<'
    }
};

export default angular.module('mpdx.preferences.import.google.component', [])
    .component('googleImportForm', GoogleImport).name;