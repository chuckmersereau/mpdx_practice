import { round, toInteger } from 'lodash/fp';
import joinComma from '../../../common/fp/joinComma';
import config from '../../../config';

class ImportTntController {
    importing: boolean;
    maxSize: number;
    maxSizeInMB: number;
    override: string;
    progressPercentage: number;
    tags: any[];
    constructor(
        $rootScope: ng.IRootScopeService,
        private $window: ng.IWindowService,
        private gettextCatalog: ng.gettext.gettextCatalog,
        private Upload: ng.angularFileUpload.IUploadService,
        private alerts: AlertsService,
        private api: ApiService,
        private contactsTags: ContactsTagsService,
        private modal: ModalService,
        private serverConstants: ServerConstantsService
    ) {
        this.importing = false;
        this.override = 'true';
        this.tags = [];

        $rootScope.$on('accountListUpdated', () => {
            this.contactsTags.load();
        });
    }
    $onInit() {
        this.maxSize = this.serverConstants.data.tnt_import.max_file_size_in_bytes;
        this.maxSizeInMB = round(this.maxSize / 1000000);
    }
    save(form) {
        this.importing = true;
        return this.Upload.upload({
            method: 'POST',
            url: `${config.apiUrl}account_lists/${this.api.account_list_id}/imports/tnt`,
            data: {
                data: {
                    type: 'imports',
                    attributes: {
                        file: form.file,
                        tag_list: joinComma(this.tags),
                        override: this.override
                    }
                }
            }
        }).then(() => {
            this.importing = false;
            this.tags = [];
            form.file = null;
            this.modal.open({
                template: require('./success/success.html'),
                controller: 'importTntSuccessController'
            });
        }, (err) => {
            this.importing = false;
            this.alerts.addAlert(this.gettextCatalog.getString('File upload failed.'), 'danger');
            throw err;
        }, (evt) => {
            this.progressPercentage = toInteger(100.0 * evt.loaded / evt.total);
        });
    }
}

const ImportTnt = {
    controller: ImportTntController,
    template: require('./tnt.html')
};

import * as Upload from 'ng-file-upload';
import alerts, { AlertsService } from '../../../common/alerts/alerts.service';
import contactsTags, { ContactsTagsService } from '../../../contacts/sidebar/filter/tags/tags.service';
import 'angular-gettext';
import modal, { ModalService } from '../../../common/modal/modal.service';
import serverConstants, { ServerConstantsService } from '../../../common/serverConstants/serverConstants.service';
import { ApiService } from '../../../common/api/api.service';

export default angular.module('mpdx.tools.import.tnt.component', [
    'gettext', Upload,
    alerts, contactsTags, modal, serverConstants
]).component('importTnt', ImportTnt).name;