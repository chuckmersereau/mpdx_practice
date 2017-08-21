import includes from 'lodash/fp/includes';

class ImportCsvController {
    constructor(
        $window,
        $transitions, $state, gettextCatalog,
        importCsv, modal
    ) {
        this.$state = $state;
        this.$window = $window;
        this.$transitions = $transitions;
        this.gettextCatalog = gettextCatalog;
        this.modal = modal;
        this.importCsv = importCsv;

        this.deregisterTransitionHook = null;
    }

    $onInit() {
        if (this.$state.$current.name === 'tools.import.csv') {
            this.$state.go('tools.import.csv.upload');
        }

        const message
            = this.gettextCatalog.getString(
                'Are you sure you want to navigate away from this CSV Import? You will lose all unsaved progress.'
            );

        this.$window.onbeforeunload = (e) => {
            e.returnValue = message;
            return message;
        };

        this.deregisterTransitionHook = this.$transitions.onBefore(
            {
                from: 'tools.import.csv.**',
                to: (state) => {
                    return !includes('tools.import.csv', state.name);
                }
            },
            () => {
                if (!this.importCsv.data) {
                    return true;
                }
                return this.modal.confirm(message);
            }
        );
    }

    $onDestroy() {
        this.$window.onbeforeunload = undefined;

        if (this.deregisterTransitionHook) {
            this.deregisterTransitionHook();
        }
    }
}

const ImportCsv = {
    controller: ImportCsvController,
    template: require('./csv.html')
};

import gettextCatalog from 'angular-gettext';
import uiRouter from '@uirouter/angularjs';
import importCsv from 'tools/import/csv/csv.service';
import modal from 'common/modal/modal.service';

export default angular.module('mpdx.tools.import.csv.component', [
    gettextCatalog, uiRouter,
    importCsv, modal
]).component('importCsv', ImportCsv).name;
