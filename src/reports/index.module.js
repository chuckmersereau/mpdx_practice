import balances from './balances/balances.component';
import component from './reports.component';
import monthly from './monthly/monthly.component';
import contributionsReport from './contributionsReport/contributionsReport.component';
import donationsReport from './donations/index.module';

export default angular.module('mpdx.reports', [
    balances,
    component,
    contributionsReport,
    donationsReport,
    monthly
]).name;
