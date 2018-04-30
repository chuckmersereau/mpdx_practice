class PreviewController {
    accept: boolean;
    constructor(
        $rootScope: ng.IRootScopeService,
        private gettextCatalog: ng.gettext.gettextCatalog,
        private contactsTags: ContactsTagsService,
        private importCsv: ImportCsvService,
        private modal: ModalService,
        private serverConstants: ServerConstantsService
    ) {
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

import 'angular-gettext';
import contactsTags, { ContactsTagsService } from '../../../../contacts/sidebar/filter/tags/tags.service';
import importCsv, { ImportCsvService } from '../csv.service';
import modal, { ModalService } from '../../../../common/modal/modal.service';
import serverConstants, { ServerConstantsService } from '../../../../common/serverConstants/serverConstants.service';

export default angular.module('mpdx.tools.import.csv.preview.component', [
    'gettext',
    contactsTags, importCsv, modal, serverConstants
]).component('importCsvPreview', Preview).name;
