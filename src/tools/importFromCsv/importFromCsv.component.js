class ImportFromCsvController {
    alerts;
    modal;
    importFromCsv;
    serverConstants;
    contactsTags;

    constructor(
        $log, $state, alerts, modal, blockUI, gettextCatalog,
        importFromCsv, serverConstants, contactsTags
    ) {
        this.$log = $log;
        this.$state = $state;
        this.alerts = alerts;
        this.modal = modal;
        this.gettextCatalog = gettextCatalog;
        this.blockUI = blockUI.instances.get('import-from-csv');
        this.importFromCsv = importFromCsv;
        this.serverConstants = serverConstants;
        this.contactsTags = contactsTags;

        this.step = 1;
        this.accept = false;
        this.available_constants = {};
        this.selectedHeaders = [];
    }

    setStep(n) {
        this.accept = false;
        this.importFromCsv.data.in_preview = true;

        if (n === 2 && this.importFromCsv.data === null) {
            this.step = 1;
            return;
        }

        if (n === 3 && _.isEmpty(this.available_constants)) {
            this.importFromCsv.values_to_constants_mapping = {};

            if (this.step < 3) {
                this.importFromCsv.update().then(() => {
                    this.step = 4;
                }, (error) => {
                    this.step = 2;
                    this.$log.error(error);
                    _.each(error.data.errors, (err) => {
                        this.alerts.addAlert(err.detail, 'danger', 10);
                    });
                });
            } else {
                this.step = 2;
            }

            return;
        }

        this.step = n;
    }

    advance() {
        if (this.step === 4) {
            return;
        }

        this.setStep(this.step + 1);
    }

    back() {
        if (this.step === 1) {
            return;
        }

        this.setStep(this.step - 1);
    }

    canAdvance() {
        switch (this.step) {
            case 2:
                return !_.isEmpty(this.importFromCsv.headers_to_fields_mapping);
            case 3:
                let valid = true;
                _.each(this.available_constants, (obj, constant) => {
                    if (valid) {
                        const constants = obj.values;
                        if (constants) {
                            const selectedConstants = _.keys(this.importFromCsv.values_to_constants_mapping[constant]);
                            valid = constants.length === selectedConstants.length && _.intersection(constants, selectedConstants).length === constants.length;
                        }
                    }
                });
                return valid;
            case 4:
                return this.accept;
        }

        return true;
    }

    upload(file) {
        this.blockUI.start();

        this.importFromCsv.upload(file).then(() => {
            this.blockUI.stop();
            this.$log.debug('Upload');
            this.$log.debug(this.importFromCsv.data);
            this.advance();
        }, (error) => {
            this.blockUI.stop();
            this.$log.error(error);
            const title = this.gettextCatalog.getString('Invalid CSV file');
            const message = this.gettextCatalog.getString('Please visit our help site for more information about preparing your .csv. If that does not resolve the problem please send a message to our help desk and include the .csv file you are trying to upload.');
            return this.modal.info(message, title).then(() => {
                this.importFromCsv.data = null;
            });
        });
    }

    mapHeaders() {
        if (!this.canAdvance()) {
            return;
        }

        this.blockUI.start();

        this.importFromCsv.update().then(() => {
            this.blockUI.stop();
            this.available_constants = {};
            _.each(this.importFromCsv.data.file_headers_mappings, (value, key) => {
                if (this.serverConstants.data.csv_import.constants[key] !== undefined) {
                    this.available_constants[key] = {
                        label: this.importFromCsv.data.file_headers[value],
                        values: this.importFromCsv.data.file_constants[value],
                        opts: this.serverConstants.data.csv_import.constants[key]
                    };
                }
            });

            this.advance();
        }, (error) => {
            this.blockUI.stop();
            this.$log.error(error);
            _.each(error.data.errors, (err) => {
                this.alerts.addAlert(err.detail, 'danger', 10);
            });
        });
    }

    mapValues() {
        if (!this.canAdvance()) {
            return;
        }

        this.blockUI.start();

        this.importFromCsv.update().then(() => {
            this.blockUI.stop();
            this.$log.debug('Preview');
            this.$log.debug(this.importFromCsv.data);
            this.advance();
        }, (error) => {
            this.blockUI.stop();
            this.$log.error(error);
            _.each(error.data.errors, (err) => {
                this.alerts.addAlert(err.detail, 'danger', 10);
            });
        });
    }

    confirm() {
        if (!this.canAdvance()) {
            return;
        }

        this.blockUI.start();
        this.importFromCsv.data.in_preview = false;

        this.importFromCsv.update().then(() => {
            this.blockUI.stop();
            const message = this.gettextCatalog.getString('Your import has started and your contacts will be in MPDX shortly.');
            return this.modal.info(message).then(() => {
                this.$state.go('tools');
            });
        }, (error) => {
            this.blockUI.stop();
            this.$log.error(error);
            _.each(error.data.errors, (err) => {
                this.alerts.addAlert(err.detail, 'danger', 10);
            });
        });
    }

    updateSelectedHeaders() {
        this.selectedHeaders = {};
        _.each(this.importFromCsv.headers_to_fields_mapping, (value, key) => {
            this.selectedHeaders[value] = key;
        });
    }
}

const ImportFromCsv = {
    controller: ImportFromCsvController,
    template: require('./importFromCsv.html')
};

export default angular.module('mpdx.tools.importFromCsv.component', [])
    .component('importFromCsv', ImportFromCsv).name;