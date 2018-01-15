import assign from 'lodash/fp/assign';
import defaultTo from 'lodash/fp/defaultTo';
import joinComma from 'common/fp/joinComma';
import moment from 'moment';
import bowser from 'bowser';

class ExportContactsController {
    constructor(
        $timeout, blockUI,
        api, contacts, exportContacts,
        selectedContactIds, filter
    ) {
        this.$timeout = $timeout;
        this.api = api;
        this.blockUI = blockUI.instances.get('contact-export');
        this.contacts = contacts;
        this.exportContacts = exportContacts;
        this.moment = moment;

        this.isSafari = bowser.name === 'Safari';
        filter = defaultTo(this.api.cleanFilters(this.contacts.buildFilterParams()), filter);
        this.params = {
            data: {
                filter: filter
            },
            doDeSerialization: false,
            overrideGetAsPost: true
        };
        if (selectedContactIds.length > 0) {
            this.params.data.filter.ids = joinComma(selectedContactIds);
        }
    }

    primaryCSVLink() {
        this.blockUI.start();
        return this.exportContacts.primaryCSVLink(this.params).then(() => {
            this.blockUI.reset();
        }).catch(() => {
            this.blockUI.reset();
        });
    }
    primaryXLSXLink() {
        this.blockUI.start();
        const params = assign(this.params, {
            url: 'contacts/exports.xlsx',
            headers: {
                Accept: 'application/xlsx'
            },
            responseType: 'arraybuffer'
        });
        return this.api.get(params).then((data) => {
            const blob = new Blob([data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;'
            });
            this.exportContacts.sendDownload(blob, `mpdx-contact-export-${moment().format('Y-MM-DD-HH:mm')}.xlsx`);
        }).then(() => {
            this.blockUI.reset();
        }).catch(() => {
            this.blockUI.reset();
        });
    }
    mailingCSVLink() {
        this.blockUI.start();
        const params = assign(this.params, {
            url: 'contacts/exports/mailing.csv',
            headers: {
                Accept: 'text/csv'
            }
        });
        return this.api.get(params).then((data) => {
            const blob = new Blob([data], {
                type: 'text/csv;charset=utf-8;'
            });
            this.exportContacts.sendDownload(blob, `mpdx-mailing-export-${moment().format('Y-MM-DD-HH:mm')}.csv`);
        }).then(() => {
            this.blockUI.reset();
        }).catch(() => {
            this.blockUI.reset();
        });
    }
}

import blockUI from 'angular-block-ui';
import contacts from 'contacts/contacts.service';
import exportContacts from './export.service';

export default angular.module('mpdx.contacts.list.exportContacts.controller', [
    blockUI,
    contacts, exportContacts
]).controller('exportContactsController', ExportContactsController).name;
