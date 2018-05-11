import balances from './balances/balances.component';
import component from './reports.component';
import contributions from './contributions/contributions.component';
import donations from './donations/donations.module';
import monthly from './monthly/monthly.component';

export default angular.module('mpdx.reports', [
    balances,
    component,
    contributions,
    donations,
    monthly
]).name;
