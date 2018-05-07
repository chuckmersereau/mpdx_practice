import config from '../../../config';

export class ExportContactsService {
    constructor(
        private $window: ng.IWindowService,
        private api: ApiService
    ) {}
    create(filters: any, format: string = 'csv', mailing: boolean = false): ng.IPromise<void> {
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

import api, { ApiService } from '../../../common/api/api.service';

export default angular.module('mpdx.contacts.list.exportContacts.service', [
    api
]).service('exportContacts', ExportContactsService).name;
