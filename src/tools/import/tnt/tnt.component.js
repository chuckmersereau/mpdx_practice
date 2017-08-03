import round from "lodash/fp/round";
import joinComma from "common/fp/joinComma";
import config from 'config';

class ImportTntController {
    constructor(
        $rootScope, $window, gettextCatalog, Upload,
        alerts, api, contactsTags, modal, serverConstants
    ) {
        this.$window = $window;
        this.alerts = alerts;
        this.api = api;
        this.contactsTags = contactsTags;
        this.gettextCatalog = gettextCatalog;
        this.modal = modal;
        this.serverConstants = serverConstants;
        this.Upload = Upload;

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
        }, err => {
            this.importing = false;
            this.alerts.addAlert(this.gettextCatalog.getString('File upload failed.'), 'danger');
            throw err;
        }, (evt) => {
            this.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        });
    }
}

const ImportTnt = {
    controller: ImportTntController,
    template: require('./tnt.html')
};

import Upload from 'ng-file-upload';
import alerts from 'common/alerts/alerts.service';
import contactsTags from 'contacts/sidebar/filter/tags/tags.service';
import gettext from 'angular-gettext';
import modal from 'common/modal/modal.service';
import serverConstants from 'common/serverConstants/serverConstants.service';

export default angular.module('mpdx.tools.import.tnt.component', [
    gettext, Upload,
    alerts, contactsTags, modal, serverConstants
]).component('importTnt', ImportTnt).name;