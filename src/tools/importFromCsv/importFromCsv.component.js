const each = require('lodash/fp/each').convert({ 'cap': false });
import isEmpty from 'lodash/fp/isEmpty';
import difference from 'lodash/fp/difference';
import keys from 'lodash/fp/keys';
import values from 'lodash/fp/values';
import reduceObject from '../../common/fp/reduceObject';

class ImportFromCsvController {
    alerts;
    modal;
    importFromCsv;
    serverConstants;
    contactsTags;

    constructor(
        $log, $window, $scope, $transitions, $state, alerts, modal, blockUI, gettextCatalog,
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
        this.unmappedHeaders = [];

        const message = this.gettextCatalog.getString('Wait! Are you sure you want to navigate away from the current page? If you leave you will lose all progress?');

        $window.onbeforeunload = (e) => {
            e.returnValue = message;
            return message;
        };

        const deregisterTransitionHook = $transitions.onBefore({from: 'tools.importFromCSV'}, () => {
            if (!this.importFromCsv.data) {
                return;
            }

            blockUI.instances.get('root').reset();

            return this.modal.confirm(message);
        });

        $scope.$on('$destroy', () => {
            $window.onbeforeunload = undefined;

            if (deregisterTransitionHook) {
                deregisterTransitionHook();
            }
        });
    }

    setStep(n) {
        this.accept = false;
        this.importFromCsv.data.in_preview = true;

        if (n === 2 && this.importFromCsv.data === null) {
            this.step = 1;
            return;
        }

        if (n === 3 && isEmpty(this.available_constants)) {
            this.importFromCsv.values_to_constants_mapping = {};

            if (this.step < 3) {
                this.importFromCsv.update().then(() => {
                    this.step = 4;
                }, (error) => {
                    this.step = 2;
                    this.$log.error(error);
                    each(err => {
                        this.alerts.addAlert(err.detail, 'danger', 10);
                    }, error.data.errors);
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
                this.unmappedHeaders = difference(
                    keys(this.serverConstants.data.csv_import.required_headers),
                    values(this.importFromCsv.headers_to_fields_mapping));

                return !isEmpty(this.importFromCsv.headers_to_fields_mapping) && this.unmappedHeaders.length === 0;
            case 4:
                return this.accept;
        }

        return true;
    }

    upload(form) {
        this.blockUI.start();

        this.importFromCsv.upload(form.file).then(() => {
            this.blockUI.stop();
            this.$log.debug('Upload');
            this.$log.debug(this.importFromCsv.data);
            this.advance();
        }, (error) => {
            form.file = null;
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
            each((value, key) => {
                if (this.serverConstants.data.csv_import.constants[key]) {
                    // fix for integer/float keys
                    const pledgeFrequencies = reduceObject((result, v, k) => {
                        if (k >= 1) {
                            result[parseInt(k).toFixed(1)] = v;
                        } else {
                            result[k] = v;
                        }
                        return result;
                    }, {}, this.serverConstants.data.pledge_frequencies);

                    const opts = reduceObject((result, v, k) => {
                        switch (key) {
                            case 'commitment_frequency':
                                result[k] = pledgeFrequencies[v];
                                break;
                            case 'send_appeals':
                                if (v === 'true') {
                                    result[k] = 'Yes';
                                } else if (v === 'false') {
                                    result[k] = 'No';
                                }
                                break;
                            default:
                                result[k] = v;
                        }
                        return result;
                    }, {}, this.serverConstants.data.csv_import.constants[key]);

                    this.available_constants[key] = {
                        label: this.importFromCsv.data.file_headers[value],
                        values: this.importFromCsv.data.file_constants[value],
                        opts: opts
                    };
                }
            }, this.importFromCsv.data.file_headers_mappings);

            this.advance();
        }, (error) => {
            this.blockUI.stop();
            this.$log.error(error);
            each(err => {
                this.alerts.addAlert(err.detail, 'danger', 10);
            }, error.data.errors);
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
            each(err => {
                this.alerts.addAlert(err.detail, 'danger', 10);
            }, error.data.errors);
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
            const message = this.gettextCatalog.getString('Your import has started and your contacts will be in MPDX shortly. We will email you when your import is complete.');
            return this.modal.info(message).then(() => {
                this.importFromCsv.data = null;
                this.$state.go('tools');
            });
        }, (error) => {
            this.blockUI.stop();
            this.$log.error(error);
            each(err => {
                this.alerts.addAlert(err.detail, 'danger', 10);
            }, error.data.errors);
        });
    }

    updateSelectedHeaders() {
        this.selectedHeaders = {};
        each((value, key) => {
            this.selectedHeaders[value] = key;
        }, this.importFromCsv.headers_to_fields_mapping);
    }
}

const ImportFromCsv = {
    controller: ImportFromCsvController,
    template: require('./importFromCsv.html')
};

export default angular.module('mpdx.tools.importFromCsv.component', [])
    .component('importFromCsv', ImportFromCsv).name;
