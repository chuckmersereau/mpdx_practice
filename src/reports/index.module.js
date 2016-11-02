import balances from './balances/balances.component';
import component from './reports.component';
import donations from './donations/donations.component';
import monthly from './mothly/monthly.component';

export default angular.module('mpdx.reports', [
    balances,
    component,
    donations,
    monthly
]).name;