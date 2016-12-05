import config from 'config';

class ExportContactsController {
    constructor(
        $window
    ) {
        this.$window = $window;
    }
    primaryCSVLink() {
        return `${config.apiUrl}contacts/export/primary.csv?access_token=${this.$window.sessionStorage.token}`;
    }
    primaryXLSXLink() {
        return `${config.apiUrl}contacts/export/primary.xlsx?access_token=${this.$window.sessionStorage.token}`;
    }
    mailingCSVLink() {
        return `${config.apiUrl}contacts/export/mailing.csv?access_token=${this.$window.sessionStorage.token}`;
    }
}


export default angular.module('mpdx.contacts.list.exportContacts.controller', [])
    .controller('exportContactsController', ExportContactsController).name;
