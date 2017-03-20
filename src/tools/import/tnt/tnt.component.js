class TntImportController {
    save() {
    }
}

const TntImport = {
    controller: TntImportController,
    template: require('./tnt.html')
};

export default angular.module('mpdx.preferences.import.tnt.component', [])
    .component('tntImportForm', TntImport).name;