import alerts from './alerts/index.module';
import anniversaries from './anniversaries/anniversaries.component';
import birthdays from './birthdays/birthdays.component';
import contacts from './contacts/index.module';
import donationSummaryChart from './donationsSummaryChart/donationsSummaryChart.directive';
import links from './links/index.module';
import modal from './modal/modal.service';
import rawNumber from './rawNumber/rawNumber.directive';

export default angular.module('mpdx.common', [
    alerts,
    anniversaries,
    birthdays,
    contacts,
    donationSummaryChart,
    links,
    modal,
    rawNumber
]).name;