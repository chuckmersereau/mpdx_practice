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
        let params: any = {};
        return this.api.get('reports/weeklies', params).then((data) => {
            return data;
        });
    }
    loadReport(reportId: any): ngIpromise<any> {
        let params: any = {
            session_id: reportId
        };
        return this.api.get('reports/weeklies/133fec79-4586-4e6a-a652-c10e1a799af4', params).then((data) => {
            return data;
        });
    }
    saveReport(id: number, report: any): ngIpromise<any> {
        for (let i = 0; i < report.length; i++) {
            report[i] = {
                id: uuid(),
                type: 'weeklies',
                // session_id: id,
                // question_id: report[i].qid,
                answer: report[i].answer,
                relationships: {
                    question: {
                        question_id: report[i].qid,
                        type: 'question'
                    },
                    session: {
                        session_id: id,
                        type: 'session'
                    }
                }
            };
        }
        let params = {
            url: 'reports/bulk',
            data: report,
            type: 'weeklies'
        };
        console.log('WEEKLY SERVICE / SAVE / report: ', report);
        return this.api.post(params).then((data) => {
            console.log('WEEKLY SERVICE / SAVE / return data: ', data);
            return data;
        });
    }
}

export default angular.module('mpdx.reports.weekly.service', []).service('weekly', WeeklyService).name;
