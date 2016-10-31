import balances from './balances/balances.component';
import component from './reports.component';
import donations from './donations/donations.component';

export default angular.module('mpdx.reports', [
    balances,
    component,
    donations
]).name;