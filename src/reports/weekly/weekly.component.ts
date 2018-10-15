import { DATA } from '../DATA.ts';
import weekly, { WeeklyService } from './weekly.service';

class WeeklyController {
  recents: boolean=false;
  new: boolean=false;
  reportsTab: boolean=false;
  comparison: boolean= false;
  reports: any;
  recentReport: any;
  newReport: any;
  displayReport: any;
  questions: any;
  state: string;
  constructor(
    private weekly: WeeklyService,
    private $rootScope: ng.IRootScopeService,
  ) {
      this.reports = [];
      this.displayReport = this.recentReport = {
          id: null,
          created_at: null,
          responses: []
      };
      this.newReport = [];
      this.questions = [];
      this.changeState('Empty');
  }
  $onInit() {
      console.log('INITIALIZING WEEKLY');
      this.load();
  }
  private load() {
      console.log('LOADING QUESTIONS');
      this.weekly.loadQuestions().then((data) => {
          for (let i = 0; i < data.length; i++) {
              this.questions.push({ qid: data[i].id, question: data[i].question });
          }

          console.log('LOADING REPORTS');
          this.weekly.loadReports().then((data) => {
              if (data) {
                  this.addReports(data);
                  this.recents = true;
                  let newestReport = this.reports[this.reports.length - 1];

                  console.log('LOADING SINGLE REPORT');
                  this.weekly.loadReport(newestReport.id).then((data) => {
                      console.log('COMPONENT / LOAD FIRST REPORT / return data', data);
                      console.log(data);
                      this.recentReport.id = newestReport.id;
                      this.recentReport.created_at = newestReport.created_at;
                      this.recentReport.responses = this.fillReport(data);
                      this.displayReport = this.recentReport;
                      this.changeState('View Recent');
                  });
              }
          });
      });
  }
  private fillReport(data: any): any {
      let report = [];
      for (let i = 0; i < data.length; i++) {
          report.push({ qid: data[i].question_id, answer: data[i].answer });
      }
      return report;
  }
  private changeState(state: string): void {
      this.state = state;
      this.reportsTab = false;
      if (this.state === 'New Report') {
          this.startNewReport();
      }
      if (this.state === 'Continue') {
          this.state = 'New Report';
      }
      if (this.state === 'View Recent') {
          this.reportsTab = true;
      }
  }
  private startNewReport(): void {
      this.newReport = [];
      for (let i = 0; i < this.questions.length; i++) {
          this.newReport.push({ qid: this.questions[i].qid, answer: '' });
      }
      this.new = true;
  }
  private onSubmit(): void {
      this.logReport(this.newReport).then((data) => {
          this.newReport = [];
          this.new = false;
          this.changeState('View Recent');
      });
  }
  private logReport(report: any): void {
      console.log('SAVING RESPONSES');
      return this.weekly.saveReport(report).then((data) => {
          for (let i = 0; i < data.length; i++) {
              data[i] = data[i].data.attributes;
          }
          report = { id: data[0].sid, created_at: data[0].created_at, responses: this.fillReport(data) };
          this.recentReport = report;
          this.displayReport = this.recentReport;
          this.recents = true;
          this.addReports([data[0]]);
          return report;
      });
  }
  private onClear(): void {
      for (let i = 0; i < this.newReport.length; i++) {
          this.newReport[i].answer = '';
      }
  }
  private toggleComparison(): void {
      this.comparison = !this.comparison;
  }
  private changeDisplayReport(report: any): void {
      let id = report.id;
      this.weekly.loadReport(id).then((data) => {
          this.displayReport = { id: id, created_at: report.created_at, responses: this.fillReport(data) };
      });
  }
  private fillAnswer(id: any): void {
      let answer = '';
      for (let i = 0; i < this.recentReport.responses.length; i++) {
          if (parseInt(this.recentReport.responses[i].qid) === parseInt(id)) {
              answer = this.recentReport.responses[i].answer;
              break;
          }
      }
      for (let i = 0; i < this.newReport.length; i++) {
          if (parseInt(this.newReport[i].qid) === parseInt(id)) {
              this.newReport[i].answer = answer;
              break;
          }
      }
  }
  private getAnswer(id: any): any {
      let answer = '';
      let report: any;
      if (this.state === 'View Recent') {
          report = this.displayReport;
      } else {
          report = this.recentReport;
      }
      for (let i = 0; i < report.responses.length; i++) {
          if (parseInt(report.responses[i].qid) === parseInt(id)) {
              answer = report.responses[i].answer;
          }
      }
      return answer;
  }
  private showAnswer(answer: any): any {
      return answer === '' ? '-' : answer;
  }
  private addReports(data: any): void{
      for (let i = 0; i < data.length; i++) {
          let entry = data[i];
          this.reports.push({ uuid: entry.id, id: entry.sid, created_at: entry.created_at });
      }
      this.reports = this.reports.sort(function(a, b) {
          return new Date(a.created_at) - new Date(b.created_at);
      });
  }
  private getModel(qid: any): any {
      let entry = '';
      for (let i = 0; i < this.newReport.length; i++) {
          if (parseInt(this.newReport[i].qid) === parseInt(qid)) {
              entry = this.newReport[i];
          }
      }
      return entry;
  }
}

const Weekly = {
    style: require('./_weekly.scss'),
    controller: WeeklyController,
    template: require('./weekly.html')
};

export default angular.module('mpdx.reports.weekly.component', [
    weekly
]).component('weekly', Weekly).name;
