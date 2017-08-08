import round from 'lodash/fp/round';

class UploadController {
    constructor(
        importCsv, serverConstants
    ) {
        this.importCsv = importCsv;
        this.serverConstants = serverConstants;

        this.maxSize = this.serverConstants.data.csv_import.max_file_size_in_bytes;
        this.maxSizeInMB = round(this.maxSize / 1000000);
    }
}

const Upload = {
    controller: UploadController,
    template: require('./upload.html')
};

import importCsv from 'tools/import/csv/csv.service';
import serverConstants from 'common/serverConstants/serverConstants.service';

export default angular.module('mpdx.tools.import.csv.upload.component', [
    importCsv, serverConstants
]).component('importCsvUpload', Upload).name;