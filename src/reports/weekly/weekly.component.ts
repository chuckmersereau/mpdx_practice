import { DATA, Entry } from '../entry.ts';

class WeeklyController {
  recents: boolean=false;
  new: boolean=false;
  reports: any;
  recentReport: any;
  newReport: any;
  displayReport: any;
  questions: any;
  state: string;
  comparison: boolean= false;
  constructor() {
      this.reports = [];
      this.recentReport = [];
      this.newReport = [];
      this.displayReport = [];
      this.makeFakeReport();
      if (this.reports.length === 0) {
          this.state = 'Empty';
      } else {
          this.state = 'View Recent';
          this.recents = true;
      }
      this.questions = [];
      for (let i = 0; i < DATA.length; i++) {
          this.questions.push({ id: DATA[i].id, question: DATA[i].question });
      }
  }
  private makeFakeReport(): void {
      this.recentReport = [];
      for (let i = 0; i < DATA.length; i++) {
          this.recentReport.push({ id: DATA[i].id, answer: DATA[i].answer });
      }
      this.recentReport[0].answer = new Date();
      this.displayReport = this.recentReport;
      this.recents = true;
      this.reports.push(this.recentReport);
  }
  private changeState(state: string): void {
      this.state = state;
      if (this.state === 'New Report') {
          this.startNewReport();
      }
      if (this.state === 'Continue') {
          this.state = 'New Report';
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
      this.recentReport = this.newReport;
      this.displayReport = this.recentReport;
      this.newReport = [];
      this.reports.push(this.recentReport);
      this.new = false;
      this.recents = true;
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
}

const Weekly = {
    style: require('./_weekly.scss'),
    controller: WeeklyController,
    template: require('./weekly.html')
};

export default angular.module('mpdx.reports.weekly.component', [])
    .component('weekly', Weekly).name;
