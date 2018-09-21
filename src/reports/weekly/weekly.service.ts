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
    loadQuestions(): ngIpromise<any> {
        let params: any = {};
        let successMessage = 'Got dem questions';
        let errorMessage = 'Shoot, couldn\'t get the questions';

        // return this.api.get('reports/weeklies', { include: include }).then((data) => {
        return this.api.get('reports/questions', params, successMessage, errorMessage).then((data) => {
            return data;
        });
    }
    loadReports(): ngIpromise<any> {
        let params: any = {};
        let successMessage = 'I found out if there are reports. There may be some, there may be none.';
        let errorMessage = 'Master, I have failed you.';
        return this.api.get('reports/weeklies', params, successMessage, errorMessage).then((data) => {
            // console.log('WEEKLY / LOADREPORTS / data', data);
            return data;
        });
    }
    loadReport(reportId: number): ngIpromise<any> {
        console.log('Getting Report of ID:', reportId);
        let params: any = {
            session_id: reportId
        };
        let successMessage = 'WE DID IT!';
        let errorMessage = 'Keep trying bucko';
        return this.api.get('reports/weeklies', params, successMessage, errorMessage).then((data) => {
            return data;
        });
    }
}

export default angular.module('mpdx.reports.weekly.service', [
    'gettext',
    api, serverConstants
]).service('weekly', WeeklyService).name;
