import assign from 'lodash/fp/assign';
import joinComma from "../../../common/fp/joinComma";
import moment from 'moment';

class ExportContactsController {
    api;
    contacts;
    moment;
    constructor(
        $timeout, blockUI,
        api, contacts,
        selectedContactIds
    ) {
        this.$timeout = $timeout;
        this.api = api;
        this.blockUI = blockUI.instances.get('contact-export');
        this.contacts = contacts;
        this.moment = moment;

        this.params = {
            data: {
                filter: this.api.cleanFilters(this.contacts.buildFilterParams())
            },
            doDeSerialization: false,
            overrideGetAsPost: true
        };
        if (selectedContactIds.length > 0) {
            this.params.data.filter.ids = joinComma(selectedContactIds);
        }
    }
    sendDownload(blob, filename) {
        if (window.navigator.msSaveOrOpenBlob) {
            navigator.msSaveBlob(blob, filename);
        } else {
            const downloadContainer = angular.element('<div id="downloadLink" data-tap-disabled="true"><a></a></div>');
            let downloadLink = angular.element(downloadContainer.children()[0]);
            downloadLink.attr('href', window.URL.createObjectURL(blob));
            downloadLink.attr('download', filename);
            downloadLink.attr('target', '_blank');

            angular.element('body').append(downloadContainer);
            this.$timeout(() => {
                downloadLink[0].click();
                downloadLink.remove();
                window.URL.revokeObjectURL(blob);
            }, null);
        }
    }
    primaryCSVLink() {
        this.blockUI.start();
        const params = assign(this.params, {
            url: 'contacts/exports.csv',
            headers: {
                Accept: 'text/csv'
            }
        });
        return this.api.get(params).then((data) => {
            const blob = new Blob([data], {
                type: `text/csv;charset=utf-8;`
            });
            this.sendDownload(blob, `mpdx-contact-export-${moment().format('Y-MM-DD-HH:mm')}.csv`);
        }).finally(() => {
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
                type: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;`
            });
            this.sendDownload(blob, `mpdx-contact-export-${moment().format('Y-MM-DD-HH:mm')}.xlsx`);
        }).finally(() => {
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
                type: `text/csv;charset=utf-8;`
            });
            this.sendDownload(blob, `mpdx-mailing-export-${moment().format('Y-MM-DD-HH:mm')}.csv`);
        }).finally(() => {
            this.blockUI.reset();
        });
    }
}

import blockUI from 'angular-block-ui';
import contacts from 'contacts/contacts.service';

export default angular.module('mpdx.contacts.list.exportContacts.controller', [
    blockUI,
    contacts
]).controller('exportContactsController', ExportContactsController).name;
