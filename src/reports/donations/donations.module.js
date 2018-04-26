import chart from './chart/chart.component';
import component from './donations.component';
import modal from './modal/modal.controller';

export default angular.module('mpdx.reports.donations', [
    chart,
    component,
    modal
]).name;
