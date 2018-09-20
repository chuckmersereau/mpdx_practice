import * as moment from 'moment';
import {
    assign,
    defaultTo,
    findIndex,
    map,
    pullAllBy,
    toNumber
} from 'lodash/fp';
import { DATA, Entry } from '../entry.ts';
import { StateParams } from '@uirouter/core';
import api, { ApiService } from '../../common/api/api.service';
import contacts, { ContactsService } from '../../contacts/contacts.service';
import designationAccounts, { DesignationAccountsService } from '../../common/designationAccounts/designationAccounts.service';
import donations, { DonationsService } from './donations.service';
import joinComma from '../../common/fp/joinComma';
import locale, { LocaleService } from '../../common/locale/locale.service';
import serverConstants, { ServerConstantsService } from '../../common/serverConstants/serverConstants.service';
import uiRouter from '@uirouter/angularjs';
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
    private $log: ng.ILogService,
    private api: ApiService,
    private weekly: WeeklyService,

    private $q: ng.IQService,
    private $rootScope: ng.IRootScopeService,
    private $stateParams: StateParams,
    private contacts: ContactsService,
    private designationAccounts: DesignationAccountsService,
    private donations: DonationsService,
    private locale: LocaleService,
    private serverConstants: ServerConstantsService
  ) {
      this.reports = [];
      this.recentReport = [];
      this.newReport = [];
      this.displayReport = [];
      this.questions = [];
      this.changeState('Empty');
  }
  $onInit() {
      console.log('INITIALIZING WEEKLY');
      this.load();
  }
  private load() {
      this.weekly.loadQuestions().then((data) => {
          console.log(data);
          for (let i = 0; i < data.length; i++) {
              this.questions.push({ ndx: i, id: data[i].question_id, question: data[i].question });
          }
      });
      this.weekly.loadReports().then((data) => {
          console.log(data);
          if (data) {
              this.reports = data;
              this.recents = true;
          }
      });
      if (this.recents) {
          this.weekly.loadReport(this.reports[0]).then((data) => {
              console.log(data);
              this.fillReport(data);
              this.changeState('View Recent');
          });
      }
  }
  private fillReport(data: any): void {
      let report = [];
      report.push({ id: 0, answer: new Date(data.created_at) });
      for (let i = 0; i < data.length; i++) {
          report.push({ id: data[i].question_id, answer: data[i].answer });
      }
      this.logReport(report);
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
      this.new = true;
  }
  private onSubmit(): void {
      this.logReport(this.newReport);
      this.newReport = [];
      this.new = false;
      this.changeState('View Recent');
  }
  private logReport(report: any): void {
      this.recentReport = report;
      this.displayReport = this.recentReport;
      this.recents = true;
      this.reports.push(this.recentReport);
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
  private getAnswer(id: number): any {
      for (let i = 0; i < this.displayReport.length; i++) {
          if (this.displayReport[i].id === id) {
              return this.displayReport[i];
          }
      }
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

export default angular.module('mpdx.reports.weekly.component', [
    weekly
]).component('weekly', Weekly).name;
