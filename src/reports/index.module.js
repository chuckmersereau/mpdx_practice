import balances from './balances/balances.component';
import component from './reports.component';
import contribution from './contribution/contribution.component';
import donations from './donations/donations.component';
import monthly from './mothly/monthly.component';

export default angular.module('mpdx.reports', [
    balances,
    component,
    contribution,
    donations,
    monthly
]).name;