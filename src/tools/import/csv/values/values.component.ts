import { invert } from 'lodash/fp';

class ValuesController {
    constructor(
        private importCsv: ImportCsvService,
        private serverConstants: ServerConstantsService
    ) {}
    save() {
        this.importCsv.save();
    }
    back() {
        this.importCsv.back();
    }
    fileHeader(constant) {
        return this.importCsv.data.file_headers[invert(this.importCsv.data.file_headers_mappings)[constant]];
    }
}

const Values = {
    controller: ValuesController,
    template: require('./values.html')
};

import importCsv, { ImportCsvService } from '../../../import/csv/csv.service';
import serverConstants, { ServerConstantsService } from '../../../../common/serverConstants/serverConstants.service';

export default angular.module('mpdx.tools.import.csv.values.component', [
    importCsv, serverConstants
]).component('importCsvValues', Values).name;