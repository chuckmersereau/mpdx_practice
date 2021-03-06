import 'angular-gettext';
import { difference, includes, keys, union, values } from 'lodash/fp';
import importCsv, { ImportCsvService } from '../../../import/csv/csv.service';
import modal, { ModalService } from '../../../../common/modal/modal.service';
import serverConstants, { ServerConstantsService } from '../../../../common/serverConstants/serverConstants.service';

class HeadersController {
    mappedHeaders: any[];
    unmappedHeaders: any[];
    constructor(
        private gettextCatalog: ng.gettext.gettextCatalog,
        private importCsv: ImportCsvService,
        private modal: ModalService,
        private serverConstants: ServerConstantsService
    ) {
        this.mappedHeaders = [];
        this.unmappedHeaders = [];
    }
    $onInit() {
        this.updateHeaders();
    }
    updateHeaders() {
        this.mappedHeaders = values(this.importCsv.data.file_headers_mappings);
        let requiredHeaders = keys(this.serverConstants.data.csv_import.required_headers);
        requiredHeaders = union(['first_name', 'last_name', 'full_name'], requiredHeaders);
        requiredHeaders = this.containsName() ? difference(requiredHeaders, ['first_name', 'last_name', 'full_name']) : requiredHeaders;
        this.unmappedHeaders = difference(requiredHeaders, this.mappedHeaders);
    }
    containsName() {
        return (includes('first_name', this.mappedHeaders) && includes('last_name', this.mappedHeaders)) || includes('full_name', this.mappedHeaders);
    }
    save() {
        this.importCsv.values_to_constants_mappings = {};
        return this.importCsv.save();
    }
    back() {
        const message = this.gettextCatalog.getString(
            'Are you sure you want to navigate back to the upload step? You will lose all unsaved progress.');

        return this.modal.confirm(message).then(() => {
            this.importCsv.back();
        });
    }
}

const Headers = {
    controller: HeadersController,
    template: require('./headers.html')
};

export default angular.module('mpdx.tools.import.csv.headers.component', [
    'gettext',
    importCsv, modal, serverConstants
]).component('importCsvHeaders', Headers).name;
