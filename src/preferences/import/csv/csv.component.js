class CsvImportController {
    constructor(gettextCatalog) {
        this.gettextCatalog = gettextCatalog;
    }
    save() {

    }
}

const CsvImport = {
    controller: CsvImportController,
    template: require('./csv.html')
};

export default angular.module('mpdx.preferences.import.csv.component', [])
    .component('csvImportForm', CsvImport).name;