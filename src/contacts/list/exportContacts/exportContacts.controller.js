import assign from 'lodash/fp/assign';
import joinComma from "../../../common/fp/joinComma";
import moment from 'moment';

class ExportContactsController {
    api;
    contacts;
    moment;
    constructor(
        $timeout,
        api, contacts,
        selectedContactIds
    ) {
        this.$timeout = $timeout;
        this.api = api;
        this.contacts = contacts;
        this.moment = moment;

        this.params = {
            data: {
                filter: this.api.cleanFilters(this.contacts.buildFilterParams())
            },
            doDeSerialization: false
        };
        if (selectedContactIds.length > 0) {
            this.params.data.filter.ids = joinComma(selectedContactIds);
        }
    }
    sendDownload(blob, filename) {
        if (window.navigator.msSaveOrOpenBlob) {
            navigator.msSaveBlob(blob, filename);
        } else {
            const downloadContainer = angular.element('<div data-tap-disabled="true"><a></a></div>');
            let downloadLink = angular.element(downloadContainer.children()[0]);
            downloadLink.attr('href', window.URL.createObjectURL(blob));
            downloadLink.attr('download', filename);
            downloadLink.attr('target', '_blank');

            document.getElementsByTagName('body')[0].append(downloadContainer);
            this.$timeout(() => {
                downloadLink[0].click();
                downloadLink.remove();
            }, null);
        }
    }
    primaryCSVLink() {
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
        });
    }
    primaryXLSXLink() {
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
        });
    }
    mailingCSVLink() {
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
        });
    }
}


export default angular.module('mpdx.contacts.list.exportContacts.controller', [])
    .controller('exportContactsController', ExportContactsController).name;
