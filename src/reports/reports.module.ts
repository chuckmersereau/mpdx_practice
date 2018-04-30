import balances from './balances/balances.component';
import component from './reports.component';
import monthly from './monthly/monthly.component';
import contributions from './contributions/contributions.component';
import donations from './donations/donations.module';

export default angular.module('mpdx.reports', [
    balances,
    component,
    contributions,
    donations,
    monthly
]).name;
