class GoogleImportController {
    constructor(gettextCatalog) {
        this.gettextCatalog = gettextCatalog;
    }
    save() {

    }
}

const GoogleImport = {
    controller: GoogleImportController,
    controllerAs: 'vm',
    template: require('./google.html'),
    bindings: {
        preferences: '<'
    }
};

export default angular.module('mpdx.preferences.import.google.component', [])
    .component('googleImportForm', GoogleImport).name;