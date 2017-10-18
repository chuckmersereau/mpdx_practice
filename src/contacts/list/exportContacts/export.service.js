import assign from 'lodash/fp/assign';
import moment from 'moment';

class ExportContacts {
    constructor(
        $timeout,
        api
    ) {
        this.$timeout = $timeout;
        this.api = api;
    }
    primaryCSVLink(params) {
        params = assign(params, {
            url: 'contacts/exports.csv',
            headers: {
                Accept: 'text/csv'
            }
        });
        return this.api.get(params).then((data) => {
            const blob = new Blob([data], {
                type: 'text/csv;charset=utf-8;'
            });
            this.sendDownload(blob, `mpdx-contact-export-${moment().format('Y-MM-DD-HH:mm')}.csv`);
        });
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
}

import api from 'common/api/api.service';

export default angular.module('mpdx.contacts.list.exportContacts.service', [
    api
]).service('exportContacts', ExportContacts).name;