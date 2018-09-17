import { DATA, Entry } from '../entry.ts';

class WeeklyController {
  recents: boolean=false;
  new: boolean=false;
  reports: any;
  reportsTab: boolean=false;
  recentReport: any;
  newReport: any;
  displayReport: any;
  questions: any;
  state: string;
  comparison: boolean= false;
  constructor(
    private $log: ng.ILogService,
  ) {
      this.reports = [];
      this.recentReport = [];
      this.newReport = [];
      this.displayReport = [];
      this.questions = [];

      this.$log.debug('checking it out');

      this.makeFakeReport();
      if (this.reports.length === 0) {
          this.changeState('Empty');
      } else {
          this.changeState('View Recent');
      }
      for (let i = 0; i < DATA.length; i++) {
          this.questions.push({ id: DATA[i].id, question: DATA[i].question });
      }
  }
  private makeFakeReport(): void {
      let report1 = [];
      let report2 = [];
      report1.push({ id: DATA[0].id, answer: new Date(DATA[0].answer) });
      report2.push({ id: DATA[0].id, answer: new Date() });
      for (let i = 1; i < DATA.length; i++) {
          report2.push({ id: DATA[i].id, answer: DATA[i].answer });
          let answer: any;
          if (parseInt(DATA[i].answer)) {
              answer = parseInt(DATA[i].answer) / 2;
          } else {
              answer = DATA[i].answer;
          }
          report1.push({ id: DATA[i].id, answer: answer });
      }
      this.logReport(report1);
      this.logReport(report2);
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
          this.newReport.push({ id: this.questions[i].id, answer: '' });
      }
      this.newReport[0].answer = new Date();
      this.new = true;
  }
  private onSubmit(): void {
      this.logReport(this.newReport);
      this.newReport = [];
      this.new = false;
      this.changeState('View Recent');
  }
  private onClear(): void {
      for (let i = 1; i < this.newReport.length; i++) {
          this.newReport[i].answer = '';
      }
  }
  private toggleComparison(): void {
      if (this.comparison) {
          this.comparison = false;
      } else {
          this.comparison = true;
      }
  }
  private changeDisplayReport(report: any): void {
      this.displayReport = report;
  }
  private fillAnswer(i: number): void {
      this.newReport[i].answer = this.recentReport[i].answer;
  }
  private logReport(report: any): void {
      this.recentReport = report;
      this.displayReport = this.recentReport;
      this.recents = true;
      this.reports.push(this.recentReport);
  }
  private showAnswer(answer: any): any {
      return answer === '' ? '-' : answer;
  }
}

const Weekly = {
    style: require('./_weekly.scss'),
    controller: WeeklyController,
    template: require('./weekly.html')
};

export default angular.module('mpdx.reports.weekly.component', [])
    .component('weekly', Weekly).name;
