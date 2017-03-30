import config from 'config';

class TntImportController {
    alerts;
    api;
    modal;
    constructor(
        $window, gettextCatalog, Upload,
        alerts, api, contactsTags, modal
    ) {
        this.$window = $window;
        this.alerts = alerts;
        this.api = api;
        this.contactsTags = contactsTags;
        this.gettextCatalog = gettextCatalog;
        this.modal = modal;
        this.Upload = Upload;
        this.importing = false;

        this.override = true;
        this.tags = [];
    }
    save(form) {
        this.importing = true;
        this.Upload.upload({
            url: `${config.apiUrl}account_lists/${this.api.account_list_id}/imports/tnt`,
            data: {
                data: {
                    type: 'imports',
                    attributes: {
                        file: form.file,
                        tags: this.tags
                    }
                }
            },
            headers: {
                Authorization: `Bearer ${this.$window.localStorage.getItem('token')}`
            }
        }).then(() => {
            this.importing = false;
            this.tags = [];
            form.file = null;
            this.modal.open({
                template: require('./success/success.html'),
                controller: 'tntSuccessController'
            });
        }, () => {
            this.importing = false;
            this.alerts.addAlert(this.gettextCatalog.getString('File upload failed.'), 'danger');
        }, () => {
            // const progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            // console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });
    }
}

const TntImport = {
    controller: TntImportController,
    template: require('./tnt.html')
};

export default angular.module('mpdx.preferences.import.tnt.component', [])
    .component('tntImportForm', TntImport).name;