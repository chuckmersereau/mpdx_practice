class PreviewController {
    constructor(
        $rootScope,
        gettextCatalog,
        contactsTags, importCsv, modal
    ) {
        this.gettextCatalog = gettextCatalog;
        this.contactsTags = contactsTags;
        this.importCsv = importCsv;
        this.modal = modal;

        this.accept = false;

        $rootScope.$on('accountListUpdated', () => {
            this.contactsTags.load();
        });
    }
    $onInit() {
        this.contactsTags.load();
    }

    save() {
        this.importCsv.data.in_preview = false;
        return this.importCsv.save().then(() => {
            this.importCsv.data = null;
            const message = this.gettextCatalog.getString(
                'Your CSV import has started and your contacts will be in MPDX shortly. We will email you when your import is complete.'
            );
            return this.modal.info(message);
        });
    }

    back() {
        this.importCsv.back();
    }
}

const Preview = {
    controller: PreviewController,
    template: require('./preview.html')
};

import gettextCatalog from 'angular-gettext';
import contactsTags from 'contacts/sidebar/filter/tags/tags.service';
import importCsv from 'tools/import/csv/csv.service';
import modal from 'common/modal/modal.service';

export default angular.module('mpdx.tools.import.csv.preview.component', [
    gettextCatalog,
    contactsTags, importCsv, modal
]).component('importCsvPreview', Preview).name;