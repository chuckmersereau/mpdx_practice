import balances from './balances/balances.component';
import component from './reports.component';

export default angular.module('mpdx.reports', [
    balances,
    component
]).name;