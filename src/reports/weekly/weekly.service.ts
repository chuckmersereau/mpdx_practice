import alerts, { AlertsService } from '../../common/alerts/alerts.service';
import api, { ApiService } from '../../common/api/api.service';

export class WeeklyService {
    constructor(
        private api: ApiService,
        private alerts: AlertsService
    ) {}
    loadQuestions(): ngIpromise<any> {
        let params: any = {};
        return this.api.get('reports/questions', params).then((data) => {
            return data;
        });
    }
    loadReports(): ngIpromise<any> {
        let params: any = {};
        return this.api.get('reports/weeklies', params).then((data) => {
            return data;
        });
    }
    loadReport(reportId: any): ngIpromise<any> {
        console.log('Getting Report of ID:', reportId);
        let params: any = {
            session_id: reportId// reportId
        };
        return this.api.get('reports/weeklies/133fec79-4586-4e6a-a652-c10e1a799af4', params).then((data) => {
            return data;
        });
    }
    saveReport(report: any): ngIpromise<any> {
        let params: any = {

        };
        return this.api.post('reports/bulk').then((data) => {
            console.log(data);
            return data;
        });
    }
}

export default angular.module('mpdx.reports.weekly.service', []).service('weekly', WeeklyService).name;
