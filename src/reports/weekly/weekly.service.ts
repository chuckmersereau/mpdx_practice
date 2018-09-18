import 'angular-gettext';
import * as moment from 'moment';
import { has } from 'lodash/fp';
import api, { ApiService } from '../../common/api/api.service';
import serverConstants, { ServerConstantsService } from '../../common/serverConstants/serverConstants.service';

export class WeeklyService {
    constructor(
        private $log: ng.ILogService,
        private gettextCatalog: ng.gettext.gettextCatalog,
        private api: ApiService,
        private serverConstants: ServerConstantsService
    ) {}
    load(): ngIpromise<any> {
        let params: any = {
            fields: {
                questions: '',
                contacts: 'name',
                designation_account: 'display_name,designation_number',
                donor_account: 'display_name,account_number',
                appeal: 'name',
                pledge: 'contact'
            },
            filter: {},
            include: 'designation_account,donor_account,contact,appeal,pledge,pledge.contact',
            sort: '-donation_date'
        };

        let include = 'questions';

        // return this.api.get('reports/weeklies', { include: include }).then((data) => {
        return this.api.get('reports/weeklies').then((data) => {
            return data;
        });
    }
}

export default angular.module('mpdx.reports.weekly.service', [
    'gettext',
    api, serverConstants
]).service('weekly', WeeklyService).name;
