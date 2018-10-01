import * as uuid from 'uuid/v1';
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
        return this.api.get('user').then((user) => {
            console.log(user);
            let params = {
                user: user.id
            };
            return this.api.get(`reports/sessions/${user.id}`).then((data) => {
                console.log(data);
                return data;
            });
        });
    }
    loadReport(reportId: any): ngIpromise<any> {
        let params: any = {
            session_id: reportId// reportId
        };
        return this.api.get('reports/weeklies/133fec79-4586-4e6a-a652-c10e1a799af4', params).then((data) => {
            return data;
        });
    }
    saveReport(id: number, report: any): ngIpromise<any> {
        for (let i = 0; i < report.length; i++) {
            report[i] = {
                id: uuid(),
                sid: id,
                question: {
                    id: report[i].qid
                },
                answer: report[i].answer
            };
        }
        let params = {
            url: 'reports/bulk',
            data: report,
            type: 'weeklies',
            doDeSerialization: false
        };
        return this.api.post(params).then((data) => {
            console.log('WEEKLY SERVICE / SAVE / return data: ', data);
            return data;
        });
    }
}

export default angular.module('mpdx.reports.weekly.service', []).service('weekly', WeeklyService).name;
