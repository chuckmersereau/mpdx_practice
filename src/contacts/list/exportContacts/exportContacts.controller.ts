import { defaultTo } from 'lodash/fp';
import joinComma from '../../../common/fp/joinComma';

class ExportContactsController {
    filters: any;
    isSafari: boolean;
    params: any;
    constructor(
        private $scope: mgcrea.ngStrap.modal.IModalScope,
        private $timeout: ng.ITimeoutService,
        private gettextCatalog: ng.gettext.gettextCatalog,
        private alerts: AlertsService,
        private api: ApiService,
        private contacts: ContactsService,
        private exportContacts: ExportContactsService,
        selectedContactIds: string[],
        filters: any
    ) {
        this.filters = this.filterParams(filters, selectedContactIds);
    }
    exportMailingCSV(): ng.IPromise<void> {
        return this.exportContacts.create(this.filters, 'csv', true).then(() => {
            this.alerts.addAlert(this.gettextCatalog.getString(
                'Mailing Addresses for contacts exported successfully as a CSV file'
            ));
            this.$scope.$hide();
        });
    }
    exportCSV(): ng.IPromise<void> {
        return this.exportContacts.create(this.filters, 'csv').then(() => {
            this.alerts.addAlert(this.gettextCatalog.getString(
                'Contacts exported successfully as a CSV file'
            ));
            this.$scope.$hide();
        });
    }
    exportXLSX(): ng.IPromise<void> {
        return this.exportContacts.create(this.filters, 'xlsx').then(() => {
            this.alerts.addAlert(this.gettextCatalog.getString(
                'Contacts exported successfully as a XLSX file'
            ));
            this.$scope.$hide();
        });
    }
    filterParams(filters: any, selectedContactIds: string[]): any {
        filters = defaultTo(this.api.cleanFilters(this.contacts.buildFilterParams()), filters);
        if (selectedContactIds && selectedContactIds.length > 0) {
            filters.ids = joinComma(selectedContactIds);
        }
        return filters;
    }
}

import 'angular-block-ui';
import 'angular-gettext';
import alerts, { AlertsService } from '../../../common/alerts/alerts.service';
import contacts, { ContactsService } from '../../../contacts/contacts.service';
import exportContacts, { ExportContactsService } from './export.service';
import api, { ApiService } from '../../../common/api/api.service';

export default angular.module('mpdx.contacts.list.exportContacts.controller', [
    'gettext',
    alerts, api, contacts, exportContacts
]).controller('exportContactsController', ExportContactsController).name;
