import { round } from 'lodash/fp';
import importCsv, { ImportCsvService } from '../../../import/csv/csv.service';
import serverConstants, { ServerConstantsService } from '../../../../common/serverConstants/serverConstants.service';

class UploadController {
    maxSize: number;
    maxSizeInMB: number;
    constructor(
        private importCsv: ImportCsvService,
        private serverConstants: ServerConstantsService
    ) {
        this.maxSize = this.serverConstants.data.csv_import.max_file_size_in_bytes;
        this.maxSizeInMB = round(this.maxSize / 1000000);
    }
}

const Upload: ng.IComponentOptions = {
    controller: UploadController,
    template: require('./upload.html')
};

export default angular.module('mpdx.tools.import.csv.upload.component', [
    importCsv, serverConstants
]).component('importCsvUpload', Upload).name;