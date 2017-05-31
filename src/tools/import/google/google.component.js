class GoogleImportController {
    constructor(
        $rootScope,
        contactsTags
    ) {
        this.contactsTags = contactsTags;

        $rootScope.$on('accountListUpdated', () => {
            this.contactsTags.load();
        });
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

import contactsTags from 'contacts/sidebar/filter/tags/tags.service';

export default angular.module('mpdx.tools.import.google.component', [
    contactsTags
]).component('googleImportForm', GoogleImport).name;