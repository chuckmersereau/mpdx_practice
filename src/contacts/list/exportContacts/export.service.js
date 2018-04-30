import config from 'config';

class ExportContacts {
    constructor(
        $window,
        api
    ) {
        this.$window = $window;
        this.api = api;
    }
    create(filters, format = 'csv', mailing = false) {
        let pathAddition = '';
        if (mailing) {
            pathAddition = '/mailing';
        }
        return this.api.post({
            url: `contacts/exports${pathAddition}`,
            data: {
                params: {
                    filter: filters
                }
            },
            type: 'export_logs'
        }).then((data) => {
            let token = this.$window.localStorage.getItem('token');
            this.$window.location.replace(
                `${config.apiUrl}contacts/exports${pathAddition}/${data.id}.${format}?access_token=${token}`
            );
        });
    }
}

import api from 'common/api/api.service';

export default angular.module('mpdx.contacts.list.exportContacts.service', [
    api
]).service('exportContacts', ExportContacts).name;
