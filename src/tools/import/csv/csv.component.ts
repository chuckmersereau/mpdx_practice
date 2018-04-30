import { includes } from 'lodash/fp';

class ImportCsvController {
    deregisterTransitionHook: any;
    constructor(
        private $window: ng.IWindowService,
        private $transitions: TransitionService,
        private $state: StateService,
        private gettextCatalog: ng.gettext.gettextCatalog,
        private importCsv: ImportCsvService,
        private modal: ModalService
    ) {
        this.deregisterTransitionHook = null;
    }
    $onInit() {
        if (this.$state.$current.name === 'tools.import.csv') {
            this.$state.go('tools.import.csv.upload');
        }

        const message = this.gettextCatalog.getString(
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
            (): any => {
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

import 'angular-gettext';
import uiRouter from '@uirouter/angularjs';
import importCsv, { ImportCsvService } from '../../import/csv/csv.service';
import modal, { ModalService } from '../../../common/modal/modal.service';
import { StateService, TransitionService } from '@uirouter/core';

export default angular.module('mpdx.tools.import.csv.component', [
    'gettext', uiRouter,
    importCsv, modal
]).component('importCsv', ImportCsv).name;
