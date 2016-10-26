import alerts from './alerts/index.module';
import anniversaries from './anniversaries/anniversaries.component';
import bgImg from './bgImg/bgImg.directive';
import birthdays from './birthdays/birthdays.component';
import contacts from './contacts/index.module';
import donationSummaryChart from './donationsSummaryChart/donationsSummaryChart.directive';
import links from './links/index.module';
import modal from './modal/modal.service';

export default angular.module('mpdx.common', [
    alerts,
    anniversaries,
    bgImg,
    birthdays,
    contacts,
    donationSummaryChart,
    links,
    modal
]).name;