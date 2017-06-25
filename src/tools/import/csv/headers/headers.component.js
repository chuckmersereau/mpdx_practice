import difference from 'lodash/fp/difference';
import includes from 'lodash/fp/includes';
import keys from 'lodash/fp/keys';
import union from 'lodash/fp/union';
import values from 'lodash/fp/values';

class HeadersController {
    importCsv;
    modal;
    serverConstants;

    constructor(
        gettextCatalog,
        importCsv, modal, serverConstants
    ) {
        this.gettextCatalog = gettextCatalog;
        this.importCsv = importCsv;
        this.modal = modal;
        this.serverConstants = serverConstants;

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
        if ((includes('first_name', this.mappedHeaders) && includes('last_name', this.mappedHeaders)) || includes('full_name', this.mappedHeaders)) {
            requiredHeaders = difference(requiredHeaders, ['first_name', 'last_name', 'full_name']);
        }
        this.unmappedHeaders = difference(requiredHeaders, this.mappedHeaders);
    }

    save() {
        this.importCsv.values_to_constants_mapping = {};
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

import gettextCatalog from 'angular-gettext';
import importCsv from 'tools/import/csv/csv.service';
import modal from 'common/modal/modal.service';
import serverConstants from 'common/serverConstants/serverConstants.service';

export default angular.module('mpdx.tools.import.csv.headers.component', [
    gettextCatalog,
    importCsv, modal, serverConstants
]).component('importCsvHeaders', Headers).name;
