import { defaultTo } from 'lodash/fp';
import joinComma from 'common/fp/joinComma';

class ExportContactsController {
    constructor(
        $scope,
        gettextCatalog,
        alerts, api, contacts, exportContacts,
        selectedContactIds, filters
    ) {
        this.$scope = $scope;

        this.gettextCatalog = gettextCatalog;

        this.alerts = alerts;
        this.api = api;
        this.contacts = contacts;
        this.exportContacts = exportContacts;

        this.filters = this.filterParams(filters, selectedContactIds);
    }
    exportMailingCSV() {
        return this.exportContacts.create(this.filters, 'csv', true).then(() => {
            this.alerts.addAlert(this.gettextCatalog.getString(
                'Mailing Addresses for contacts exported successfully as a CSV file'
            ));
            this.$scope.$hide();
        });
    }
    exportCSV() {
        return this.exportContacts.create(this.filters, 'csv').then(() => {
            this.alerts.addAlert(this.gettextCatalog.getString(
                'Contacts exported successfully as a CSV file'
            ));
            this.$scope.$hide();
        });
    }
    exportXLSX() {
        return this.exportContacts.create(this.filters, 'xlsx').then(() => {
            this.alerts.addAlert(this.gettextCatalog.getString(
                'Contacts exported successfully as a XLSX file'
            ));
            this.$scope.$hide();
        });
    }
    filterParams(filters, selectedContactIds) {
        filters = defaultTo(this.api.cleanFilters(this.contacts.buildFilterParams()), filters);
        if (selectedContactIds && selectedContactIds.length > 0) {
            filters.ids = joinComma(selectedContactIds);
        }
        return filters;
    }
}

import gettext from 'angular-gettext';
import alerts from 'common/alerts/alerts.service';
import api from 'common/api/api.service';
import contacts from 'contacts/contacts.service';
import exportContacts from './export.service';

export default angular.module('mpdx.contacts.list.exportContacts.controller', [
    gettext,
    alerts, api, contacts, exportContacts
]).controller('exportContactsController', ExportContactsController).name;
